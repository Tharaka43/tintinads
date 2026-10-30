<?php

namespace App\Services;

class AdDescriptionFormatter
{
    /**
     * Clean and format cluttered ad descriptions by restoring proper line breaks,
     * removing dollar-sign censorship masks, and formatting packages into readable lists.
     * Guaranteed to be idempotent (safe to run multiple times).
     */
    public static function format(?string $text): string
    {
        if (empty($text)) {
            return '';
        }

        // 1. Fix common censor substitutions that hurt readability
        $replacements = [
            '/\$how/i' => 'Show',
            '/boob\$/i' => 'Boobs',
            '/pu\$\$y/i' => 'Pussy',
            '/finger\$/i' => 'Fingering',
            '/hot \$ound\$/i' => 'Hot sounds',
            '/\$ound\$/i' => 'sounds',
            '/\$uck/i' => 'Suck',
            '/\$hot/i' => 'Shot',
            '/\bAnl\b/i' => 'Anal',
            '/\bjuce out\b/i' => 'Juice out',
            '/\bWitut\b/i' => 'Without',
            '/\bGenuin\b/i' => 'Genuine',
            '/\bFiger\b/i' => 'Figure',
            '/\bMunite\b/i' => 'Minute',
            '/\bmunite\b/i' => 'minute',
        ];
        foreach ($replacements as $pattern => $rep) {
            $text = preg_replace($pattern, $rep, $text);
        }

        // 2. Put major dividers on their own line
        $text = preg_replace('/(\-{3,}|\={3,}|\_{3,}|\*{3,})/u', "\n\n$1\n\n", $text);

        // 3. Section headers on their own line (strip existing duplicate icons first)
        $headerPatterns = [
            '/(?:✨\s*)*(?:MY PACKAGES|My packages|Our packages|Packages|Today Special Offers|Today special package|Special Offers|My package)\s*[:👇🔊]*\s*/iu' => "\n\n✨ My Packages:\n",
            '/(?:🛑\s*)*(?:MY CONDITIONS|My conditions|Conditions|Our conditions|Condition)\s*[:👇]*\s*/iu' => "\n\n🛑 Conditions:\n",
            '/(?:🌸\s*)*(?:MY SERVICES|My services|Our services)\s*[:👇]*\s*/iu' => "\n\n🌸 Services:\n",
            '/(?:📍\s*)*(?:Location\s*:|ස්ථානය\s*:)\s*/iu' => "\n\n📍 Location: ",
            '/(?:💳\s*)*(?:Payment Methods|Payments metd|Payment\s*:)\s*/iu' => "\n\n💳 Payment: ",
        ];
        foreach ($headerPatterns as $pattern => $rep) {
            $text = preg_replace($pattern, $rep, $text);
        }

        // 4. Linebreak before known bullet points & structural emojis (not if preceded by emoji or newline)
        $bullets = [
            '▫️', '▪️', '🔹', '🔸', '•',
            '⏰', '⏱️', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕',
            '🎥', '📸', '🎧', '🎙️', '🔊', '📳',
            '🚗', '🏠', '🏩', '🛏️',
            '❌', '🚫', '⛔', '🛑',
            '📞', '📱', '📲', '💬',
            '💵', '💳', '💰',
            '🍒', '📌', '♦️', '💖'
        ];

        foreach ($bullets as $b) {
            $escaped = preg_quote($b, '/');
            $text = preg_replace('/(?<!\n)(?<![\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}\x{FE0F}])\s*(' . $escaped . ')/u', "\n$1", $text);
        }

        // 5. Linebreak before package durations when squashed (unless already bulleted)
        $text = preg_replace('/(?<!\n)(?<![⏰⏱️🕐🕑🕒🕓🕔🕕▫️▪️🔹🔸•])\s*(?:🔹\s*)?(\d+\s*(?:minute|min|munite|Hour|hour|hr)\s*(?:Rs\.?|\/|-|\d))/iu', "\n🔹 $1", $text);

        // 6. Linebreak before "Call" / "WhatsApp" / "Phone"
        $text = preg_replace('/(?<!\n)\s*(?:📞\s*)?(CALL NOW\s*:|Call Me\s*:|Call\s*:|Whats\s*app\s*only|Chat on Whatsapp)/iu', "\n\n📞 $1 ", $text);

        // 7. Linebreak before warnings
        $text = preg_replace('/(?<!\n)\s*(?:⚠️\s*)*(බොරුවට ෆොටෝ ඉල්ලන්න එපා|බොරු Slip|බොරු Receipt|No full service)/iu', "\n⚠️ $1", $text);

        // 8. Deduplicate adjacent identical emojis (e.g. ⚠️ ⚠️ or ✨ ✨ or 💳 💳)
        $text = preg_replace('/(⚠️\s*){2,}/u', "⚠️ ", $text);
        $text = preg_replace('/(✨\s*){2,}/u', "✨ ", $text);
        $text = preg_replace('/(💳\s*){2,}/u', "💳 ", $text);
        $text = preg_replace('/(🔹\s*){2,}/u', "🔹 ", $text);

        // Fix any accidental split between clock and duration/bullet
        $text = preg_replace('/(\n[⏰⏱️🕐-🕕])\s*\n\s*(?:🔹\s*)?/u', "$1 🔹 ", $text);
        // Fix any accidental split between audio/voice/chat and details
        $text = preg_replace('/(\n[🎙️🔊📳💵])\s*\n\s*/u', "$1 ", $text);

        // 9. Clean up multiple empty lines & trim
        $lines = explode("\n", $text);
        $cleaned = [];
        $prevEmpty = false;
        foreach ($lines as $line) {
            $trimmed = trim($line);
            if ($trimmed === '') {
                if (!$prevEmpty && count($cleaned) > 0) {
                    $cleaned[] = '';
                    $prevEmpty = true;
                }
            } else {
                $cleaned[] = $trimmed;
                $prevEmpty = false;
            }
        }

        return trim(implode("\n", $cleaned));
    }
}
