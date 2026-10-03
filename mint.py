import os
import re
from urllib.parse import urlparse
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, ContextTypes, MessageHandler, CallbackQueryHandler, CommandHandler, filters

# Токени бот тавассути Environment Variable (барои амният дар сервер) гирифта мешавад
TOKEN = os.getenv("TOKEN")

# Сомонаҳои бехавф (Whitelist)
WHITELIST_DOMAINS = [
    "google.com", "youtube.com", "wikipedia.org", 
    "dushanbe-city.tj", "amonatbonk.tj"
]

# Калидвожаҳои шубҳанок / қаллобӣ
SCAM_KEYWORDS = [
    "bonus", "puli-roygon", "tuhfa", "аксия", "дарёфти-пул", 
    "free-money", "loter", "win-iphone", "dushanbe-city-", "gift"
]

# Функция барои муайян кардани намуди линк ва таҳлили он
def analyze_link_details(url_str: str, full_text: str) -> dict:
    text_lower = full_text.lower()
    parsed_url = urlparse(url_str)
    domain = parsed_url.netloc or parsed_url.path
    
    # Муайян кардани намуди линк (Тип)
    link_type = "🌐 Сомонаи оддӣ (Website)"
    if "youtube.com" in domain or "youtu.be" in domain or "vimeo.com" in domain:
        link_type = "🎬 Видео (YouTube / Видео платформа)"
    elif "t.me" in domain or "telegram.me" in domain:
        link_type = "📢 Канал ё Гурӯҳи Телеграм (Telegram Link)"
    elif any(ext in url_str.lower() for ext in [".pdf", ".apk", ".exe", ".zip", ".rar", ".mp4"]):
        link_type = "📥 Файл (Файли боргирӣ / Скачать)"

    # Санҷиш, ки оё линк хавфнок аст ё не
    is_dangerous = False
    
    is_safe = any(w_domain in domain for w_domain in WHITELIST_DOMAINS)
    if not is_safe:
        for keyword in SCAM_KEYWORDS:
            if keyword in text_lower:
                is_dangerous = True
                break
        if "-" in domain and ("city" in domain or "bank" in domain or "bonus" in domain or "puli" in domain):
            is_dangerous = True

    return {
        "domain": domain,
        "type": link_type,
        "is_dangerous": is_dangerous
    }

# Фармони /start
async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "👋 Салом! Ман боти пешрафтаи таҳлили линкҳо ҳастам.\n\n"
        "🔍 **Чӣ кор карда метавонам?**\n"
        "Ҳар гуна линкро ба ин ҷо фиристед, ман мегӯям:\n"
        "• Ин видео аст, сомона аст ё канали телеграм?\n"
        "• Ин кадом сомона аст?\n"
        "• Оё хавфнок (қаллобӣ) аст ё бехавф?"
    )

# Санҷиши паёмҳо ва таҳлили ҳамаҷониба
async def check_messages(update: Update, context: ContextTypes.DEFAULT_TYPE):
    message = update.message
    if not message or not message.text:
        return

    text = message.text
    urls = re.findall(r"(https?://\S+|www\.\S+|t\.me/\S+)", text)

    if not urls:
        if message.chat.type == "private":
            await message.reply_text("❌ Дар ин паём ягон линк ёф нашуд. Лутфан линк фиристед.")
        return

    is_private = message.chat.type == "private"

    for url in urls:
        analysis = analyze_link_details(url, text)
        
        status_text = "🔴 ХАВФНОК (Эҳтимол қаллобӣ / ФИШИНГ)" if analysis["is_dangerous"] else "🟢 БЕХАВФ (Ба назар тоза мерасад)"
        
        report = (
            f"📊 **МАЪЛУМОТ ДАР БОРАИ ЛИНК:**\n\n"
            f"🔗 **Домен:** `{analysis['domain']}`\n"
            f"📂 **Намуди линк:** {analysis['type']}\n"
            f"🛡 **Ҳолат:** {status_text}"
        )

        if is_private:
            await message.reply_text(report, parse_mode="Markdown")
        else:
            if analysis["is_dangerous"]:
                user = message.from_user
                keyboard = [
                    [
                        InlineKeyboardButton("✅ Нест кардан", callback_data=f"del_{message.message_id}"),
                        InlineKeyboardButton("❌ Рад кардан", callback_data="ignore")
                    ]
                ]
                reply_markup = InlineKeyboardMarkup(keyboard)
                await message.reply_text(
                    f"⚠️ **ДИҚҚАТ! Линки шубҳанок дарёфт шуд!**\n\n" + report,
                    reply_markup=reply_markup,
                    parse_mode="Markdown"
                )

# Управление тугмаҳо дар гурӯҳ
async def button_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    data = query.data
    if data.startswith("del_"):
        msg_id_to_delete = int(data.split("_")[1])
        try:
            await context.bot.delete_message(chat_id=query.message.chat_id, message_id=msg_id_to_delete)
            await query.edit_message_text(text="✅ Паёми хавфнок бо амри шумо нест карда шуд!")
        except Exception:
            await query.edit_message_text(text="Хатогӣ ҳангоми нест кардан.")
    elif data == "ignore":
        await query.edit_message_text(text="❌ Дархост рад шуд.")

def main():
    if not TOKEN:
        print("Хатогӣ: TOKEN ёфт нашуд! Лутфан Environment Variable-ро танзим кунед.")
        return

    application = ApplicationBuilder().token(TOKEN).build()

    application.add_handler(CommandHandler("start", start_command))
    application.add_handler(MessageHandler(filters.TEXT & (~filters.COMMAND), check_messages))
    application.add_handler(CallbackQueryHandler(button_callback))

    print("Боти таҳлилгари линкҳо омода ва кор истодааст...")
    application.run_polling()

if __name__ == "__main__":
    main()
