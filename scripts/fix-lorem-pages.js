import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const wpPagesPath = path.resolve(__dirname, "../src/data/wpPages.json");

const wpPages = JSON.parse(fs.readFileSync(wpPagesPath, "utf-8"));

// 1. Players Guide real content
const playersGuideContent = `![](https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=1200&q=80)

# Teen Patti Player's Guide: Complete Rules, Hand Hierarchy & Winning Strategy

Welcome to the official **Teen Patti Stars Player's Guide**. Teen Patti (literally translating to *"Three Cards"*) is India's most celebrated card game of skill, nerve, and strategy. Whether you're entering your first practice room or taking a seat at our high-stakes VIP cash tables, this guide covers every rule, probability, and tactical decision you need to dominate the felt.

---

## 1. Game Fundamentals & Objective

Teen Patti is played with a standard international 52-card deck (excluding Jokers) between **3 to 6 players**. 

- **The Objective**: To hold the highest-ranking 3-card hand at showdown, or to use calculated betting and aggression to convince all opponents to pack (fold) before the showdown.
- **The Boot (Ante)**: Before cards are dealt, every participating player puts an equal forced bet into the center pot. The boot establishes the starting stakes.
- **The Deal**: The virtual dealer deals 3 cards face-down to each player in clockwise order.
- **The Action**: Betting proceeds clockwise, starting with the player to the immediate left of the dealer.

---

![](https://images.unsplash.com/photo-1541278107931-e006523892df?auto=format&fit=crop&w=1200&q=80)

## 2. Official Hand Rankings (Highest to Lowest)

Card rank hierarchy from highest to lowest: **Ace (A) > King (K) > Queen (Q) > Jack (J) > 10 > 9 > 8 > 7 > 6 > 5 > 4 > 3 > 2**. Aces can act as high or low in sequences (e.g. A-K-Q and A-2-3).

### 1. Trail / Trio / Set (Three of a Kind)
Three cards of identical rank. This is the supreme hand in Teen Patti.
- **Highest Trail**: A-A-A (Three Aces)
- **Lowest Trail**: 2-2-2 (Three Twos)
- *Probability*: 0.24% (approx. 1 in 424 hands)

### 2. Pure Sequence / Straight Flush (Pakki Round)
Three consecutive cards of the **same suit**.
- **Highest Pure Sequence**: A-K-Q (of the same suit)
- **Second Highest**: A-2-3 (of the same suit)
- **Lowest Pure Sequence**: 4-3-2 (of the same suit)
- *Probability*: 0.22% (approx. 1 in 459 hands)

### 3. Normal Sequence / Straight (Run)
Three consecutive cards of **mixed suits**.
- **Highest Sequence**: A-K-Q (mixed suits)
- **Second Highest**: A-2-3 (mixed suits)
- **Lowest Sequence**: 4-3-2 (mixed suits)
- *Probability*: 3.26% (approx. 1 in 30 hands)

### 4. Color / Flush
Three cards of the **same suit** that are **not** in sequence.
- When two players both have a Flush, the highest individual card wins (e.g. A-K-J beats A-K-10). If highest cards match, second-highest card decides.
- *Probability*: 4.96% (approx. 1 in 20 hands)

### 5. Pair (Double)
Two cards of identical rank plus an unrelated third card (kicker).
- **Highest Pair**: A-A-K
- **Lowest Pair**: 2-2-3
- In a tie between identical pairs, the highest third card (kicker) determines the winner.
- *Probability*: 16.94% (approx. 1 in 6 hands)

### 6. High Card
When hands contain no pair, sequence, or flush, the hand is ranked solely by its highest card.
- **Highest High Card**: A-K-J (mixed suits)
- **Lowest High Card**: 5-3-2 (mixed suits)
- *Probability*: 74.39%

---

## 3. Player Options: Blind vs Seen

A core psychological element distinguishing Teen Patti from Western poker is the choice between playing Blind or Seen:

| Feature | Blind Player | Seen Player |
| :--- | :--- | :--- |
| **Card Status** | Cards remain face-down (unviewed) | Player has viewed their 3 cards |
| **Stake Required** | Pays 1x the current boot / table stake | Must pay 2x the current blind stake (Chaal) |
| **Advantages** | Half the cost per round; puts psychological pressure on seen players | Full information about hand strength |
| **Transition** | Can choose to become "Seen" at any subsequent betting turn | Once Seen, cannot return to Blind status |

### Actions Available on Your Turn
1. **Chaal (Call / Raise)**: Place the required bet into the pot to stay active in the hand.
2. **Pack (Fold)**: Forfeit your cards and exit the current round. All previous bets remain in the pot.
3. **Sideshow (Compromise / Backshow)**: Available only to Seen players. You may request a secret hand comparison with the player who bet immediately before you (if that player is also Seen). If accepted, both players compare hands privately, and the lower-ranking hand must pack immediately.
4. **Show (Showdown)**: When only two active players remain at the table, either player can pay for a "Show". Both reveal their cards, and the superior hand wins the entire pot.

---

## 4. Betting Structures & Table Formats

- **Fixed Limit**: Stated minimum and maximum limits for both blind and seen bets. Ideal for consistent bankroll control.
- **Pot Limit**: Maximum raise is bounded by the current total chips in the pot, creating rapid escalating pots in later rounds.
- **No Limit**: Players can wager any fraction or all of their table chip stack ("All-In") at any turn.

---

![](https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&w=1200&q=80)
 
## 5. Master Strategy: 5 Golden Rules of Winning

### 1. Strategic Blind Play
Playing blind for 2 to 3 rounds keeps your cost low while forcing Seen opponents to commit double chips to stay in the hand. When Seen players fold early, you collect the accumulated pot with zero risk.

### 2. Respect Table Position
Being the last player to act before the dealer gives you maximal informational advantage. You can see how many opponents folded, raised, or requested sideshows before committing your chips.

### 3. Use Sideshows to Eliminate Threats
If you have a decent hand (such as a high Pair or modest Sequence) and suspect a Seen opponent ahead has a speculative hand, requesting a Sideshow eliminates one opponent cheaply without letting the pot balloon further.

### 4. Disciplined Bankroll Management
Never risk more than 2% to 5% of your total bankroll on a single table boot. In Teen Patti, variance is real; protecting your chip stack ensures you remain at the table when premium monster hands (Trails, Pure Sequences) arrive.

### 5. Control Tilt & Play with Composure
Card games reward cool, analytical calculation. Never increase your bets recklessly in an attempt to chase a previous loss. Stick to your strategy limits.

---

## 6. Certified Fair Play & Security

At **Teen Patti Stars**, your game integrity is guaranteed:
- **Certified RNG (Random Number Generator)**: Cryptographically verified shuffling algorithms ensure every card dealt is 100% unpredictable with zero dealer bias.
- **Anti-Collusion AI**: Real-time table telemetry flags suspicious player pairing, chip-dumping, and coordinated play.
- **Instant 30-Second UPI Payouts**: Automated withdrawal routing directly to Google Pay, PhonePe, Paytm, and BHIM UPI accounts.`;

// 2. About Us real content
const aboutUsContent = `# About Teen Patti Stars India

**Teen Patti Stars** is India's premier real-money card gaming platform, dedicated to elevating beloved traditional Indian card games into state-of-the-art digital tournament experiences. Trusted by **50 Lakh+ verified players** across the country, our platform combines thrilling gameplay, bank-grade financial security, and lightning-fast instant withdrawals.

---

## Our Mission

Our mission is simple: **To deliver the most transparent, high-performance, and enjoyable skill-based card gaming tables in India.** 

We believe players deserve tables free from bots, zero payout delays, and a truly competitive community where strategy, card math, and psychological discipline are rewarded.

---

## The Four Pillars of Teen Patti Stars

### 1. Instant 30-Second UPI Payouts
We understand that when you win at the tables, your winnings should be in your bank account immediately. Through direct NPCI-certified banking nodes and automated settlement systems, withdrawals to Google Pay, PhonePe, Paytm, and BHIM UPI are processed in an average time of under 30 seconds, 24 hours a day, 365 days a year.

### 2. Certified RNG Fair Play & Transparency
Every deck shuffle and card distribution on our platform is powered by an independently certified Random Number Generator (RNG). Tested and audited against global cryptographic standards, our algorithms guarantee that no outcome can be predicted, manipulated, or influenced by dealers or external scripts.

### 3. Advanced Collusion Defense
Our proprietary AI security engine monitors live tables in real-time. It analyzes betting patterns, player IP geolocation, device fingerprints, and table chat to immediately detect and prevent multi-accounting, team-play collusion, or unfair chip dumping.

### 4. 24×7 Multilingual Concierge Support
Our dedicated customer experience team is available 24/7 across Hindi, English, and regional Indian languages. Whether you have questions regarding table rules, KYC verification, or tournament schedules, our support agents reply in under 2 minutes on WhatsApp and live chat.

---

## Legal & Compliance in India

Under Indian jurisprudence and rulings established by the Supreme Court of India, card games requiring analytical deduction, probability assessment, and player strategy are recognized as **games of skill**. 

Teen Patti Stars operates in strict compliance with the Information Technology Act, anti-money laundering (AML) standards, and state gaming frameworks. To ensure a safe, responsible environment:
- Players must be **18 years of age or older**.
- Strict automated KYC and Aadhaar/PAN verification before cash withdrawals.
- Geo-fencing is enforced for jurisdictions where real-money skill gaming is restricted.

---

## Join the Stars Community

Whether you enjoy friendly ₹1 boot casual tables or high-roller ₹25 Crore tournament prize pools, Teen Patti Stars provides an unmatched arena. Download the official app today and experience India's #1 card gaming destination.`;

// 3. Our Games real content
const ourGamesContent = `# Our Games: Real-Money Card Games & Live Tournaments

Welcome to the **Teen Patti Stars** game lobby. From traditional Indian 3 Patti variations to fast-paced live dealer showdowns, our platform offers certified RNG tables engineered for smooth performance on both mobile and desktop.

---

## 1. Classic Teen Patti (3 Patti)
The heart of Indian card gaming. Three cards, one winner.
- **Table Stakes**: Starting from ₹0.50 micro-boot practice tables up to ₹10,000 High Roller VIP suites.
- **Features**: Real-time multiplayer, Blind vs Seen betting, interactive Sideshows, and instant Showdowns.
- **Tournaments**: Hourly satellites, Sunday Mega Contests, and festival grand gala prize pools up to ₹25 Crores.

---

## 2. Teen Patti Variations

### Muflis (Low Card Teen Patti)
A brilliant tactical inversion of standard rules: the **lowest** hand wins the pot!
- A-A-A becomes the worst hand at the table.
- 5-3-2 of mixed suits becomes the supreme winning hand.
- Requires players to completely rethink their hand valuation and bluffing tactics.

### AK47
One of the most thrilling fast-action variations played in India:
- All **Aces, Kings, 4s, and 7s** function as wild cards (Jokers).
- Leads to huge hand strengths, frequent pure sequences, and multi-player high-pot showdowns.

### 4 Patti (Four Card Teen Patti)
Each player is dealt 4 cards instead of 3. Players must evaluate their possibilities and discard one card to form the strongest 3-card hand before the betting rounds commence.

---

## 3. Indian Rummy (13-Card Rummy)
Classic skill-based melding game for card enthusiasts:
- **Points Rummy**: Fast, single-deal format with pre-assigned rupee point values.
- **Pool Rummy (101 & 201)**: Multi-deal elimination tournament where players stay in the game until their score crosses the pool ceiling.
- **Deals Rummy**: Fixed number of deals where chips are allocated at the start and the player with the highest chip count at the end wins.

---

## 4. High-Octane Quick Games

### Andar Bahar
The timeless Indian classic featuring high-speed 50:50 betting action.
- A central "Joker" card is revealed by the dealer.
- Bet on whether matching card rank will land on **Andar** (Inside) or **Bahar** (Outside).
- Fast 15-second game cycles with instant payouts.

### Dragon vs Tiger
A lightning-fast 2-card showdown:
- One card dealt to Dragon, one to Tiger.
- Bet on which side receives the higher card (King high, Ace low), or bet on a Tie for an 8:1 payout.

### 7 Up Down
Dynamic dice excitement:
- Predict whether the roll of a pair of dice will be Under 7 (2 to 6), Exactly 7 (Lucky 7), or Over 7 (8 to 12).
- Instant multipliers and live interactive betting statistics.

---

## Table Features & Safety
- **RNG Fair Play Certified**: Every shuffle is cryptographically random.
- **Zero Bots Guaranteed**: Play only against verified, live players across India.
- **Instant UPI Cashouts**: Withdraw winnings in under 30 seconds directly to Google Pay, PhonePe, Paytm, or bank accounts.`;

// 4. Contact Us real content
const contactUsContent = `# Contact Teen Patti Stars Support

We are dedicated to providing our players with fast, transparent, and dependable customer service. Our India-based support team is available **24 hours a day, 7 days a week** to assist you with account inquiries, instant UPI deposits and withdrawals, game rules, and technical assistance.

---

## Official Support Channels

### 1. Live WhatsApp Support (Fastest)
Get connected directly with a dedicated relationship manager:
- **WhatsApp**: [Chat with us on WhatsApp](https://wa.me/919876543210)
- **Response Time**: Typically under 2 minutes
- **Languages**: English, Hindi, Punjabi, Gujarati, Marathi, Bengali, Tamil, Telugu, and Kannada

### 2. Email Inquiries
For detailed requests, KYC verification documents, or tournament sponsorship inquiries:
- **General Support**: \`support@teenpattistars.me\`
- **Rules & Fair Play**: \`rules@teenpattistars.me\`
- **Response Time**: Within 2 to 4 hours

### 3. In-App Live Helpdesk
Inside the Teen Patti Stars Android APK or Web Application, tap **Profile > 24/7 Support** to start an instant encrypted chat with our technical desk.

---

## Corporate Office
**Teen Patti Stars Technologies Pvt. Ltd.**  
Prestige Tech Park, Outer Ring Road,  
Bengaluru, Karnataka 560103, India  
**CIN**: U72900KA2021PTC147283  

---

## Frequently Asked Inquiries
- **How long do UPI withdrawals take?** Our automated gateway processes withdrawals in under 30 seconds.
- **What documents are required for KYC?** A valid PAN Card and Aadhaar Card are required for regulatory identity verification.
- **Where can I download the official APK?** Always download directly from [teenpattistars.me](https://teenpattistars.me) to ensure you have the authentic, RNG-certified release.`;

let updatedCount = 0;

for (const page of wpPages) {
  if (page.slug === "players-guide") {
    page.title = "Player's Guide";
    page.excerpt = "Master Teen Patti (3 Patti) with the official player's guide. Complete hand rankings, betting rounds, blind vs seen strategies, sideshow rules, and bankroll management.";
    page.content = playersGuideContent;
    page.coverImage = "https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=1200&q=80";
    page.badge = "Official Guide";
    page.category = "Official Guide";
    page.author = "Teen Patti Stars Master";
    updatedCount++;
  } else if (page.slug === "about-us") {
    page.title = "About Us";
    page.excerpt = "Learn about Teen Patti Stars India: India's premier certified real-money skill gaming platform, featuring instant 30-second UPI payouts, RNG fair play tables, and 24x7 player support.";
    page.content = aboutUsContent;
    page.coverImage = "https://images.unsplash.com/photo-1541278107931-e006523892df?auto=format&fit=crop&w=1200&q=80";
    page.badge = "About Us";
    page.category = "About Us";
    page.author = "Teen Patti Stars Leadership";
    updatedCount++;
  } else if (page.slug === "our-games") {
    page.title = "Our Games";
    page.excerpt = "Explore the complete lineup of real-money card games on Teen Patti Stars: Classic 3 Patti, Muflis, AK47, 4 Patti, Indian Rummy, Andar Bahar, and Dragon vs Tiger tables.";
    page.content = ourGamesContent;
    page.coverImage = "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&w=1200&q=80";
    page.badge = "Game Lobby";
    page.category = "Game Rules & Guide";
    page.author = "Table Operations";
    updatedCount++;
  } else if (page.slug === "contact-us") {
    page.title = "Contact Us";
    page.excerpt = "Need help? Contact the Teen Patti Stars 24x7 customer support team on WhatsApp, live chat, or email. Fast response times in English, Hindi, and regional languages.";
    page.content = contactUsContent;
    page.coverImage = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80";
    page.badge = "Support";
    page.category = "Support & Help";
    page.author = "Customer Care Team";
    updatedCount++;
  }
}

fs.writeFileSync(wpPagesPath, JSON.stringify(wpPages, null, 2), "utf-8");
console.log(`✅ Successfully replaced placeholder content in ${updatedCount} pages in wpPages.json!`);
