# WordQuest v1.0.0 - Release Notes

**Release Date:** February 12, 2026
**Platform:** Android, iOS, Web
**Bundle ID:** `com.wordquest.app`

---

## Welcome to WordQuest!

WordQuest is a gamified language-learning app designed for kids aged 4-15. Learn English, German, and Dutch through interactive games, earn rewards, and become a Language Hero!

---

## What's New in v1.0.0

### Learning Modules

Seven comprehensive learning modules, each with age-appropriate content across four difficulty tiers:

- **Phonics** - Master letter sounds, blending, syllables, and word origins
- **Vocabulary** - Discover new words and their meanings
- **Spelling** - Practice and perfect your spelling skills
- **Sentences** - Build and understand sentences
- **Grammar** - Learn grammar rules through play
- **Reading** - Read and comprehend stories
- **Writing** - Express yourself through writing exercises

### Interactive Question Types

Six engaging question formats to keep learning fun and varied:

- Multiple Choice
- Drag & Drop (arrange words to build sentences)
- Typing Input
- Match Pairs
- Fill in the Blank
- True or False

### Age-Appropriate Learning Paths

Content is tailored to four age groups, each with its own difficulty curve:

| Age Group | Tier Name |
|-----------|-----------|
| 4-6 | Little Learners |
| 7-9 | Word Explorers |
| 10-12 | Sentence Builders |
| 13-15 | Language Masters |

### Multilingual Support

- **English** - Full content and UI
- **German (Deutsch)** - Full content and UI
- **Dutch (Nederlands)** - Full content and UI

The app UI language and learning language can be set independently.

### Gamification System

- **XP & Levels** - Earn experience points for every correct answer with combo multipliers for streaks of correct answers
- **Coins** - Earn coins to spend in the in-app shop
- **Stars** - Earn 1-3 stars per level based on performance
- **Hearts** - 5 lives per level; answer carefully!
- **Combo Counter** - Build combos with consecutive correct answers for bonus XP
- **Daily Streak** - Maintain your streak by playing every day
- **Daily Challenges** - Complete special challenges for bonus XP rewards

### Achievements & Badges

21 collectible badges across four rarity tiers:

- **Common (5)** - First Steps, Getting Started, XP Beginner, On Fire, Perfect Score
- **Rare (6)** - Dedicated Learner, XP Hunter, Week Warrior, Perfectionist, Daily Devotee, Coin Collector
- **Epic (5)** - Century Club, XP Master, Monthly Master, Vocab Master, Grammar Guru, Spelling Bee, Treasure Hunter
- **Legendary (3)** - XP Legend, Flawless, Daily Legend

### In-App Shop

Spend earned coins on cosmetics and power-ups:

- **Avatars** - Robot, Alien, Wizard, Ninja, Astronaut, Superhero
- **Themes** - Ocean, Space, Forest, Candy
- **Power-ups** - Streak Freeze, Double XP, Extra Hearts, Free Hint

### Leaderboard

Compete with other players and track your ranking based on total XP earned.

### Profile & Stats

View your complete learning journey including total XP, level, coins, streak, completed levels, and earned badges.

---

## Onboarding

New users are guided through a 4-step onboarding flow:

1. Enter your name
2. Select your age group
3. Choose an avatar (12 options: Dragon, Unicorn, Fox, Owl, Panda, Lion, Dolphin, Eagle, Wolf, Cat, Koala, Penguin)
4. Pick your learning language

---

## Visual & UX Highlights

- Dark purple glassmorphism theme optimized for kids
- Smooth animations and transitions powered by Framer Motion
- Confetti, coin showers, and star burst celebration effects
- Bottom navigation bar for easy access to all sections
- Safe area support for modern devices (notch, Dynamic Island)
- Native keyboard and status bar integration on mobile

---

## Technical Details

- **Framework:** Next.js 16 with React 19
- **Styling:** Tailwind CSS v4 with custom animations
- **Internationalization:** next-intl v4
- **Mobile:** Capacitor 8 (Android & iOS)
- **State Management:** React Context with localStorage persistence
- **Content:** 28 levels (4 per module x 7 modules) with 10 questions each

---

## Known Limitations

- Data is stored locally on the device (no cloud sync between devices)
- Leaderboard uses simulated competitors
- Internet connection required for initial font loading (Nunito)

---

## System Requirements

- **Android:** Android 7.0 (API 24) or later
- **iOS:** iOS 14.0 or later
- **Web:** Any modern browser (Chrome, Safari, Firefox, Edge)

---

## What's Next

Future updates planned:

- Cloud sync and user accounts
- More languages (French, Spanish, Italian)
- Additional learning modules
- Multiplayer challenges
- Voice pronunciation exercises
- Parental dashboard and progress reports
