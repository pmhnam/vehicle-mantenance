import { Update, Ctx, Start, Command, On, Message, Action } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { TelegramService } from './telegram.service';
import type { TelegramContext } from './telegram.interfaces';
import { TELEGRAM_MESSAGES, TELEGRAM_REGEX } from './telegram.constants';

@Update()
export class TelegramUpdate {
  constructor(private readonly telegramService: TelegramService) {}

  @Start()
  async onStart(@Ctx() ctx: TelegramContext) {
    const from = ctx.from;
    if (!from) return;

    await this.telegramService.findOrCreateUser(from.id, ctx.chat?.id || from.id, from.username, from.first_name);

    const message = TELEGRAM_MESSAGES.WELCOME(from.first_name || 'bạn');

    await ctx.reply(message, { parse_mode: 'HTML' });
  }

  @Command('help')
  async onHelp(@Ctx() ctx: Context) {
    await ctx.reply(TELEGRAM_MESSAGES.HELP, { parse_mode: 'HTML' });
  }

  @Command('status')
  async onStatus(@Ctx() ctx: Context) {
    const from = ctx.from;
    if (!from) return;

    const response = await this.telegramService.getStatus(from.id);
    await ctx.reply(response, { parse_mode: 'HTML' });
  }

  @Command('odo')
  async onOdo(@Ctx() ctx: Context, @Message('text') text: string) {
    const from = ctx.from;
    if (!from) return;

    // Parse ODO from command: /odo 5500
    const match = text.match(TELEGRAM_REGEX.CMD_ODO);
    if (!match) {
      await ctx.reply(TELEGRAM_MESSAGES.ERROR_SYNTAX_ODO, { parse_mode: 'HTML' });
      return;
    }

    const km = parseInt(match[1], 10);
    const response = await this.telegramService.updateOdo(from.id, km);
    await ctx.reply(response, { parse_mode: 'HTML' });
  }

  @Command('newvehicle')
  async onNewVehicle(@Ctx() ctx: Context, @Message('text') text: string) {
    const from = ctx.from;
    if (!from) return;

    // Parse: /newvehicle <tên xe> | <biển số>
    const match = text.match(TELEGRAM_REGEX.CMD_NEW_VEHICLE);
    if (!match) {
      await ctx.reply(TELEGRAM_MESSAGES.ERROR_SYNTAX_NEW_VEHICLE, { parse_mode: 'HTML' });
      return;
    }

    const name = match[1].trim();
    const licensePlate = match[2].trim();

    const response = await this.telegramService.createVehicle(from.id, name, licensePlate);

    // Check if response is object with markup
    if (response.reply_markup) {
      await ctx.reply(response.text, {
        parse_mode: 'HTML',
        reply_markup: response.reply_markup,
      });
    } else {
      // Fallback or error string
      await ctx.reply(response.text, { parse_mode: 'HTML' });
    }
  }

  @Action(TELEGRAM_REGEX.ACTION_SET_PROFILE)
  async onSetProfile(@Ctx() ctx: TelegramContext) {
    const from = ctx.from;
    if (!from || !ctx.match) return;

    const profileCode = ctx.match[1];
    const response = await this.telegramService.changeUserProfile(from.id, profileCode);

    // Answer callback query (stop loading animation)
    await ctx.answerCbQuery();

    // Edit message to remove buttons or update text
    await ctx.editMessageText(response, { parse_mode: 'HTML' });
  }

  @On('text')
  async onText(@Ctx() ctx: Context, @Message('text') text: string) {
    const from = ctx.from;
    if (!from) return;

    // Ignore commands (already handled)
    if (text.startsWith('/')) return;

    // Check if this looks like a license plate
    if (TELEGRAM_REGEX.LICENSE_PLATE.test(text.trim())) {
      const response = await this.telegramService.linkVehicle(from.id, text.trim());
      await ctx.reply(response, { parse_mode: 'HTML' });
      return;
    }

    // Unknown input
    await ctx.reply(TELEGRAM_MESSAGES.UNKNOWN_INPUT, { parse_mode: 'HTML' });
  }
}
