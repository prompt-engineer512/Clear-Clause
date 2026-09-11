import { AnalysisResult } from '../types';

export const SAMPLE_ANALYSES: Record<string, AnalysisResult> = {
  'spotify': {
    id: 'spotify-tos-2026',
    companyName: 'Spotify',
    documentTitle: 'Terms and Conditions of Use & Privacy Policy',
    sourceUrl: 'https://www.spotify.com/legal/end-user-agreement/',
    analyzedDate: 'Aug 28, 2026',
    overallAssessment: 'Moderate privacy caution required. Extensive behavioral telemetry, automatic renewal with strict pre-billing cancellation windows, and mandatory arbitration.',
    overallRiskLevel: 'caution',
    scores: {
      overall: 68,
      privacy: 58,
      security: 82,
      transparency: 74,
    },
    oneMinuteSummary: {
      headline: 'Music streaming with continuous behavioral profiling and automatic subscription rollover.',
      takeaways: [
        'Collects detailed listening habits, precise location data, and third-party advertising identifiers.',
        'Subscriptions auto-renew every month unless cancelled at least 24 hours prior to billing cycle.',
        'Waives right to participate in class actions; mandates individual arbitration.',
        'You grant Spotify a royalty-free license to use playlists and user-generated content for promotional purposes.'
      ],
      narrative: 'Spotify provides clear breakdown of data collection, but automatically monetizes listening telemetry across ad networks. Premium plans auto-bill without recurring email notifications.'
    },
    dataPrivacy: {
      collectedData: [
        'Listening history, playlist creations, search queries, and interaction timestamps',
        'IP address, device identifiers, operating system, and network provider',
        'Precise GPS location (mobile app permissions)',
        'Payment details and billing address via third-party processors',
        'Voice commands and audio data when voice search features are engaged'
      ],
      usagePractices: [
        'Personalizing algorithmic recommendation feeds and Discover Weekly playlists',
        'Delivering targeted audio and banner advertisements based on listener demographic profiles',
        'Sharing aggregated listening trend analytics with record labels and podcast networks'
      ],
      sharedWithThirdParties: true,
      thirdPartiesList: [
        'Advertising networks (Google, Meta, The Trade Desk)',
        'Music record labels, publisher rights holders, and podcast creators',
        'Cloud infrastructure providers (Google Cloud Platform)'
      ],
      soldToBrokers: false,
      keyConcerns: [
        'Audio ad targeting matches real-time mood and activity profiles with commercial partners.',
        'Third-party analytics SDKs collect background data even when streaming is paused.'
      ]
    },
    refundsMoney: {
      refundPolicy: '14-day statutory cooling-off period only if service has not been accessed or streamed during that period. Once streaming starts, refund right is forfeited.',
      cancellationConditions: 'Cancellation takes effect at the end of the current pre-paid billing month. No pro-rated refunds for unused days.',
      charges: '$11.99/month for Individual Premium; $16.99/month for Duo; $19.99/month for Family.',
      hiddenCosts: [
        'Currency conversion fees if traveling abroad beyond 14 days on certain regional accounts',
        'Taxes not included in promotional trial pricing quotes in some jurisdictions'
      ],
      paymentClauses: [
        'Price changes take effect upon 30 days prior notice; continuing to stream constitutes agreement.',
        'Unsuccessful payments will be retried automatically up to 3 times before account downgrading.'
      ],
      isConcerning: false
    },
    autoRenewal: {
      hasAutoRenewal: true,
      renewalFrequency: 'Monthly or Annually depending on selected plan',
      cancellationNoticeWindow: 'Must cancel at least 24 hours prior to the next billing date',
      howToCancel: 'Account Settings → Manage Plan → Change Plan → Cancel Premium',
      deadlines: 'End of current calendar billing cycle',
      warningNotes: 'Trials automatically convert to full-price recurring monthly subscriptions unless manually cancelled prior to trial expiration.'
    },
    userRights: {
      dataAccess: true,
      dataDeletion: true,
      accountDeletion: true,
      optOutRights: [
        'Opt-out of interest-based behavioral advertising',
        'Opt-out of Facebook/social graph syncing',
        'Download raw machine-readable JSON data archive within 30 days'
      ],
      cancellationRights: 'Can cancel subscription at any time without early termination penalties.',
      jurisdictionRights: [
        'GDPR rights for European Union residents (Right to be Forgotten, Data Portability)',
        'CCPA/CPRA rights for California residents (Do Not Sell/Share My Personal Information)'
      ]
    },
    importantClauses: [
      {
        id: 'c1',
        title: 'Mandatory Binding Arbitration & Class Action Waiver',
        riskLevel: 'concerning',
        explanation: 'You waive your constitutional right to take Spotify to court or participate in a class-action lawsuit for billing errors or privacy breaches.',
        whyItMatters: 'Any legal dispute must be resolved through private, confidential one-on-one arbitration, preventing collective consumer action.',
        originalSnippet: 'You and Spotify agree that any dispute, claim, or controversy between you and Spotify arising in connection with or relating in any way to these Agreements will be determined by mandatory binding individual arbitration.',
        category: 'legal'
      },
      {
        id: 'c2',
        title: 'Automatic Conversion of Free Trials',
        riskLevel: 'caution',
        explanation: 'Promotional free or $0.99 trials automatically convert to full monthly recurring charges upon expiration without warning emails.',
        whyItMatters: 'If you forget the exact calendar date your trial ends, your credit card will be charged the regular recurring fee immediately.',
        originalSnippet: 'At the end of the promotional period, you will automatically be charged the then-current price of the Spotify Premium Service monthly.',
        category: 'financial'
      },
      {
        id: 'c3',
        title: 'License to User Playlists & Metadata',
        riskLevel: 'caution',
        explanation: 'Spotify retains a worldwide, transferable, sub-licensable license to use public playlists and profile metadata in its marketing.',
        whyItMatters: 'Curated playlists and descriptions can be used in commercial campaigns without attribution or financial compensation.',
        originalSnippet: 'You grant Spotify a non-exclusive, transferable, sub-licensable, royalty-free, perpetual, irrevocable, fully paid, worldwide license to use, reproduce, make available to the public...',
        category: 'rights'
      },
      {
        id: 'c4',
        title: 'Transparent Data Export Tooling',
        riskLevel: 'safe',
        explanation: 'Spotify provides a self-service data package download containing all past streaming history, library saves, and search logs.',
        whyItMatters: 'You can easily audit what data has been collected or port your listening history to other open tools.',
        category: 'data'
      }
    ],
    cookiePolicy: {
      cookieTypes: [
        { name: 'sp_t / sp_dc', purpose: 'Authentication and session security tokens', isTracking: false },
        { name: '_ga / _gid', purpose: 'Google Analytics traffic measurement', isTracking: true },
        { name: 'OptanonConsent', purpose: 'Cookie preference storage', isTracking: false },
        { name: 'fbp', purpose: 'Meta Pixel ad attribution and conversion tracking', isTracking: true }
      ],
      purposes: [
        'Maintaining active login across tab switches',
        'Measuring playlist engagement and stream completion metrics',
        'Retargeting users with subscription upgrade campaigns on external websites'
      ],
      trackingInformation: 'Uses cookies, local storage, pixel tags, and device fingerprints to monitor usage patterns across web and desktop players.',
      importantConcerns: [
        'Web player injects third-party marketing tags that cross-track browsing habits across external retail sites.'
      ]
    },
    relatedCases: [
      {
        id: 'rc-1',
        title: 'Swedish Data Protection Authority (IMY) Fine',
        description: 'Fined 58 million SEK for failing to provide sufficiently clear information on how users’ personal data is handled when responding to data subject access requests.',
        date: 'June 2023',
        relevance: 'Highlights past ambiguity in how Spotify disclosed specific backend data processing with third-party partners.'
      },
      {
        id: 'rc-2',
        title: 'Patent on Speech Emotion Recognition',
        description: 'Granted a patent for technology that monitors emotional state, gender, and age from voice commands to suggest music.',
        date: 'January 2021',
        relevance: 'Raised broad privacy advocacy concerns regarding potential biometric surveillance.'
      }
    ],
    policyChanges: [
      {
        id: 'pc-1',
        date: 'February 2026',
        version: 'v4.12',
        summary: 'Updated AI feature clauses regarding AI DJ personalization and playlist generation telemetry.',
        addedClauses: ['Explicit consent for generative AI playlist training data aggregation.'],
        removedClauses: ['Legacy P2P streaming protocol mentions.'],
        privacyImpact: 'neutral'
      },
      {
        id: 'pc-2',
        date: 'September 2024',
        version: 'v4.08',
        summary: 'Clarified price change notification windows and arbitration opt-out address procedures.',
        addedClauses: ['30-day email notification clause before recurring price increases.'],
        removedClauses: ['Immediate unilateral price revision rights in select markets.'],
        privacyImpact: 'positive'
      }
    ],
    trustTimeline: {
      trend: 'Stable',
      history: [
        { year: '2022', score: 70, status: 'stable', eventHighlight: 'Standardized GDPR cookie banners globally.' },
        { year: '2023', score: 62, status: 'declining', eventHighlight: 'IMY regulatory audit scrutiny in EU.' },
        { year: '2024', score: 66, status: 'improving', eventHighlight: 'Added granular privacy control panel in account settings.' },
        { year: '2025', score: 68, status: 'improving', eventHighlight: 'Clarified AI prompt usage and telemetry retention periods.' },
        { year: '2026', score: 68, status: 'stable', eventHighlight: 'Maintains current consumer arbitration & auto-renew standards.' }
      ]
    },
    alternatives: [
      {
        id: 'alt-1',
        name: 'Apple Music',
        category: 'Audio Streaming',
        score: 84,
        reason: 'Zero cross-site advertising trackers and no monetization of listening history with external ad brokers.',
        advantages: ['No ad-supported free tier tracking', 'Family sharing does not share payment cards with members', 'Stronger biometric isolation on devices']
      },
      {
        id: 'alt-2',
        name: 'Qobuz',
        category: 'Hi-Res Music',
        score: 88,
        reason: 'French-based privacy-centric streaming service fully adhering to strict French CNIL and EU GDPR norms with no commercial data reselling.',
        advantages: ['No algorithmic mood surveillance', 'Direct purchasing option keeps metadata private', 'Minimalist tracking footprint']
      }
    ]
  },
  'discord': {
    id: 'discord-tos-2026',
    companyName: 'Discord',
    documentTitle: 'Terms of Service & Community Guidelines',
    sourceUrl: 'https://discord.com/terms',
    analyzedDate: 'Aug 29, 2026',
    overallAssessment: 'Favorable on financial transparency, but concerning on content moderation surveillance, broad message scanning for safety/AI models, and automated age verification.',
    overallRiskLevel: 'caution',
    scores: {
      overall: 71,
      privacy: 60,
      security: 85,
      transparency: 79,
    },
    oneMinuteSummary: {
      headline: 'Voice and chat platform with extensive automated content scanning and server telemetry.',
      takeaways: [
        'Discord scans public server messages and media for safety, anti-abuse, and policy compliance.',
        'You grant Discord a license to transmit, store, and display your messages, avatars, and voice streams.',
        'Nitro subscriptions auto-renew monthly with straightforward cancellation in desktop client.',
        'Direct messages (DMs) are encrypted in transit but not end-to-end encrypted (Discord servers can inspect reported chats).'
      ],
      narrative: 'Discord provides very clear, plain-language terms, but user chats and voice interactions are processed on central servers without end-to-end encryption.'
    },
    dataPrivacy: {
      collectedData: [
        'Username, email address, phone number (for verification)',
        'Direct messages, server messages, attachments, and voice channel participation logs',
        'Device hardware specs, connected gaming accounts (Steam, PlayStation, Xbox, Spotify)',
        'IP address, operating system, and crash telemetry reports'
      ],
      usagePractices: [
        'Facilitating real-time voice, video, and text communication',
        'Training automated machine-learning models for spam and child safety detection',
        'Analyzing game activity to power the "Active Now" status indicators'
      ],
      sharedWithThirdParties: true,
      thirdPartiesList: [
        'Cloud hosting providers (Google Cloud, Cloudflare)',
        'Payment processors (Stripe, PayPal)',
        'Law enforcement authorities upon receipt of lawful warrants'
      ],
      soldToBrokers: false,
      keyConcerns: [
        'Lack of end-to-end encryption means Discord employees or automated systems can inspect messages flagged by users.'
      ]
    },
    refundsMoney: {
      refundPolicy: '5-day refund window for Nitro subscriptions if no Nitro perks or Server Boosts have been utilized during that period.',
      cancellationConditions: 'Cancelling Nitro stops renewal at the end of the billing period; benefits remain active until then.',
      charges: '$9.99/month for Discord Nitro; $2.99/month for Nitro Basic.',
      hiddenCosts: ['Server Boost renewals billed alongside Nitro on prorated schedules'],
      paymentClauses: ['Purchases of digital stickers, avatar decorations, and server shop items are strictly non-refundable.'],
      isConcerning: false
    },
    autoRenewal: {
      hasAutoRenewal: true,
      renewalFrequency: 'Monthly or Yearly',
      cancellationNoticeWindow: 'Can be cancelled any time prior to next billing date',
      howToCancel: 'User Settings → Subscriptions → Cancel',
      deadlines: 'End of active billing period',
      warningNotes: 'Gifted Nitro subscriptions do not auto-renew unless you manually add a credit card to renew them.'
    },
    userRights: {
      dataAccess: true,
      dataDeletion: true,
      accountDeletion: true,
      optOutRights: [
        'Opt-out of data usage for personalization and recommendation algorithms',
        'Opt-out of telemetry tracking in Privacy & Safety settings',
        'Disable game activity broadcasting per-server'
      ],
      cancellationRights: 'Easy one-click cancellation inside settings menu.',
      jurisdictionRights: ['GDPR and CCPA compliant data download requests within 30 days']
    },
    importantClauses: [
      {
        id: 'dc1',
        title: 'Non-Exclusive Content License',
        riskLevel: 'caution',
        explanation: 'You grant Discord permission to host, display, and modify formatting of your uploaded images and text messages.',
        whyItMatters: 'Essential for the service to function, but legally allows Discord to keep copies of messages on backup servers even after server deletion.',
        originalSnippet: 'When you upload or share content to Discord, you give us permission to host, copy, and share it with other users as part of the service.',
        category: 'rights'
      },
      {
        id: 'dc2',
        title: 'No End-to-End Encryption for Text or Voice',
        riskLevel: 'concerning',
        explanation: 'Private direct messages and private voice calls are decrypted on Discord servers and subject to trust & safety scanning.',
        whyItMatters: 'Unlike Signal or WhatsApp, communications are stored in plaintext on Discord server infrastructure.',
        category: 'data'
      },
      {
        id: 'dc3',
        title: 'Account Deletion Grace Period',
        riskLevel: 'safe',
        explanation: 'Provides a 14-day grace period to recover accidentally deleted accounts before permanent data shredding.',
        whyItMatters: 'Prevents immediate irreversible loss from account compromise.',
        category: 'rights'
      }
    ],
    cookiePolicy: {
      cookieTypes: [
        { name: '__cf_bm', purpose: 'Cloudflare bot detection and DDoS mitigation', isTracking: false },
        { name: 'locale', purpose: 'User UI language setting', isTracking: false },
        { name: '_ga', purpose: 'Landing page marketing attribution', isTracking: true }
      ],
      purposes: ['Session continuity', 'Security checks against bot attacks'],
      trackingInformation: 'Desktop and mobile apps use local token storage rather than traditional third-party cookies.',
      importantConcerns: ['Marketing landing pages track conversion sources from external gaming influencers.']
    },
    relatedCases: [
      {
        id: 'dc-c1',
        title: 'French CNIL Sanction',
        description: 'Fined €800,000 by French privacy watchdog CNIL in 2022 for remaining active in background voice channels without alerting users and lacking strict password policies.',
        date: 'November 2022',
        relevance: 'Prompted major privacy updates including visual voice-connected banners and updated retention schedules.'
      }
    ],
    policyChanges: [
      {
        id: 'dc-pc1',
        date: 'March 2026',
        version: 'v5.2',
        summary: 'Clarified guidelines around Teen Safety Assist and AI moderation tools.',
        addedClauses: ['Enhanced safety scanning defaults for teen accounts.'],
        removedClauses: ['Legacy arbitration venue restrictions.'],
        privacyImpact: 'positive'
      }
    ],
    trustTimeline: {
      trend: 'Improving',
      history: [
        { year: '2022', score: 62, status: 'declining', eventHighlight: 'CNIL privacy sanction regarding voice persistence.' },
        { year: '2023', score: 67, status: 'improving', eventHighlight: 'Launched Family Center and transparent data controls.' },
        { year: '2024', score: 70, status: 'improving', eventHighlight: 'Updated plain-language Community Guidelines.' },
        { year: '2025', score: 71, status: 'stable', eventHighlight: 'Introduced Teen Safety Assist with strict default filters.' },
        { year: '2026', score: 71, status: 'stable', eventHighlight: 'Consistent privacy audits and fast self-service data exports.' }
      ]
    },
    alternatives: [
      {
        id: 'alt-d1',
        name: 'Matrix / Element',
        category: 'Decentralized Chat',
        score: 95,
        reason: 'Full end-to-end encryption for all 1:1 and group rooms with self-hostable decentralized servers.',
        advantages: ['Zero centralized server inspection', 'No phone number required', 'Open-source cryptographic protocols']
      },
      {
        id: 'alt-d2',
        name: 'Revolt',
        category: 'Community Chat',
        score: 89,
        reason: 'Open source alternative to Discord with zero advertising trackers and privacy-respecting telemetry.',
        advantages: ['Self-hostable backend', 'No data selling', 'No corporate ad partner integration']
      }
    ]
  },
  'tiktok': {
    id: 'tiktok-tos-2026',
    companyName: 'TikTok (ByteDance)',
    documentTitle: 'Terms of Service & Global Privacy Policy',
    sourceUrl: 'https://www.tiktok.com/legal/terms-of-service',
    analyzedDate: 'Aug 27, 2026',
    overallAssessment: 'High privacy risk. Extensive biometric feature extraction, in-app browser keystroke monitoring capability, broad cross-device tracking, and aggressive content licensing.',
    overallRiskLevel: 'concerning',
    scores: {
      overall: 42,
      privacy: 34,
      security: 62,
      transparency: 51,
    },
    oneMinuteSummary: {
      headline: 'Short-form video app with deep behavioral harvesting, biometric collection, and extensive data sharing.',
      takeaways: [
        'Collects facial geometry, voiceprints, clipboard contents, and keystroke rhythm patterns.',
        'In-app browser can log interactions, link clicks, and inputs on external websites.',
        'Grants TikTok an unconditional, perpetual license to use, remix, and monetize your content globally.',
        'Shares rich behavioral telemetry with parent entity ByteDance and ad partner networks.'
      ],
      narrative: 'TikTok collects unprecedented biometric, device, and behavioral data points. While Project Texas / Project Clover provide regional cloud isolation, legal terms grant ByteDance extensive operational authority.'
    },
    dataPrivacy: {
      collectedData: [
        'Biometric faceprints, voiceprints, and audio speech transcripts',
        'Device clipboard contents, battery status, installed app lists, and storage specs',
        'Precise geolocation, cell tower IDs, and Wi-Fi SSID networks',
        'Keystroke patterns, tap durations, and scrolling acceleration telemetry',
        'Direct message contents and media attachments'
      ],
      usagePractices: [
        'Training proprietary recommendation algorithms and generative AI models',
        'Constructing comprehensive behavioral psychographic profiles for commercial advertisers',
        'Targeted advertising and cross-platform conversion attribution'
      ],
      sharedWithThirdParties: true,
      thirdPartiesList: [
        'ByteDance corporate affiliates and subsidiaries globally',
        'Third-party advertising partners and data measurement brokers',
        'Cloud infrastructure partners (Oracle Project Texas, NCC Group Project Clover)'
      ],
      soldToBrokers: true,
      keyConcerns: [
        'Explicit clauses allow collecting biometric identifiers from uploaded videos even without an account.',
        'In-app browser injects tracking JavaScript into viewed external websites.'
      ]
    },
    refundsMoney: {
      refundPolicy: 'Digital virtual coins, gifts, and diamonds are strictly non-refundable once purchased.',
      cancellationConditions: 'Subscriptions (like TikTok Shop or Creator Subscriptions) must be cancelled via App Store / Google Play.',
      charges: 'Variable microtransactions from $0.99 to $299.99 for virtual coin bundles.',
      hiddenCosts: ['High platform cut (up to 50%) on creator virtual gifts'],
      paymentClauses: ['Coins have no monetary value outside the TikTok platform and expire upon account termination.'],
      isConcerning: true
    },
    autoRenewal: {
      hasAutoRenewal: true,
      renewalFrequency: 'Monthly for LIVE creator subscriptions',
      cancellationNoticeWindow: '24 hours prior to billing through Apple/Google platform settings',
      howToCancel: 'Device Settings → Subscriptions → TikTok Creator Subscription',
      deadlines: 'End of active billing period',
      warningNotes: 'Virtual coin auto-reload features may trigger automatic credit card deductions when coin balances drop.'
    },
    userRights: {
      dataAccess: true,
      dataDeletion: true,
      accountDeletion: true,
      optOutRights: [
        'Opt-out of personalized ads (generic ads will still appear)',
        'Request data download (takes 3-5 business days to generate zip)'
      ],
      cancellationRights: 'Account deletion takes 30 days before permanent purging.',
      jurisdictionRights: ['Regional rights for EU GDPR and California CCPA users under local portal']
    },
    importantClauses: [
      {
        id: 'tt1',
        title: 'Biometric Identifier & Facial Geometry Harvesting',
        riskLevel: 'concerning',
        explanation: 'TikTok reserves the right to extract and store biometric data, such as face geometry and voiceprints, from all audio and video content.',
        whyItMatters: 'Biometric data cannot be changed like a password if compromised, posing persistent identity and privacy vulnerabilities.',
        originalSnippet: 'We may collect biometric identifiers and biometric information as defined under US laws, such as faceprints and voiceprints, from your User Content.',
        category: 'data'
      },
      {
        id: 'tt2',
        title: 'Perpetual Commercial Content Sub-licensing',
        riskLevel: 'concerning',
        explanation: 'TikTok can use your face, voice, and uploaded clips in worldwide television, billboard, and digital commercials without paying you royalties.',
        whyItMatters: 'You surrender commercial exclusivity over your own image and creative work once posted publicly.',
        originalSnippet: 'You grant us an unconditional, irrevocable, non-exclusive, royalty-free, fully transferable, perpetual worldwide license to use, modify, adapt, reproduce, make derivative works of...',
        category: 'rights'
      },
      {
        id: 'tt3',
        title: 'Mandatory Binding Class Action Waiver',
        riskLevel: 'concerning',
        explanation: 'Requires individual arbitration in specific legal jurisdictions, blocking collective privacy class actions.',
        whyItMatters: 'Individual users cannot band together to seek damages for massive data breaches.',
        category: 'legal'
      }
    ],
    cookiePolicy: {
      cookieTypes: [
        { name: 'tt_webid_v2', purpose: 'Persistent device identifier and cross-site profile tracking', isTracking: true },
        { name: 'mon_id', purpose: 'Ad campaign attribution and conversion measurement', isTracking: true },
        { name: 'csrf_token', purpose: 'Session security validation', isTracking: false }
      ],
      purposes: ['Targeted advertising', 'Cross-device identity stitching'],
      trackingInformation: 'Deploys TikTok Pixel across millions of e-commerce web storefronts to track user purchases even when not using TikTok.',
      importantConcerns: ['Third-party websites with TikTok Pixel send your email hashes and purchase history directly to TikTok.']
    },
    relatedCases: [
      {
        id: 'tt-c1',
        title: 'EU GDPR €345 Million Fine for Children Privacy',
        description: 'Irish Data Protection Commission fined TikTok €345M for failing to protect teenage users by setting child accounts to public by default and inadequate age verification.',
        date: 'September 2023',
        relevance: 'Confirmed systemic historical vulnerabilities in minor privacy safeguards.'
      },
      {
        id: 'tt-c2',
        title: '$92 Million US Biometric Privacy Class Settlement',
        description: 'Settled massive federal class action regarding unauthorized collection and retention of facial biometric data without explicit written consent.',
        date: 'February 2021',
        relevance: 'Demonstrated widespread extraction of biometric markers from video frames.'
      }
    ],
    policyChanges: [
      {
        id: 'tt-pc1',
        date: 'January 2026',
        version: 'v6.0',
        summary: 'Updated clauses for EU Digital Services Act and Project Clover third-party data audit oversight.',
        addedClauses: ['European user data stored in Dublin and Norway data centers.'],
        removedClauses: ['Unconditional cross-border transfers without independent trustee approval.'],
        privacyImpact: 'positive'
      }
    ],
    trustTimeline: {
      trend: 'Declining',
      history: [
        { year: '2022', score: 48, status: 'declining', eventHighlight: 'Reports on employee access to overseas journalist data.' },
        { year: '2023', score: 39, status: 'declining', eventHighlight: 'Record €345M EU regulatory penalty on child privacy.' },
        { year: '2024', score: 40, status: 'stable', eventHighlight: 'US National Security legislative mandates and Project Texas audit.' },
        { year: '2025', score: 42, status: 'improving', eventHighlight: 'Third-party code auditing reports by NCC Group in Europe.' },
        { year: '2026', score: 42, status: 'stable', eventHighlight: 'Continues broad biometric harvesting rights in standard terms.' }
      ]
    },
    alternatives: [
      {
        id: 'alt-t1',
        name: 'PeerTube',
        category: 'Decentralized Video',
        score: 96,
        reason: 'Federated, open-source video platform with zero algorithmic profiling, zero biometric harvesting, and zero ad surveillance.',
        advantages: ['No corporate parent tracking', 'Decentralized server federation', 'Full content ownership']
      },
      {
        id: 'alt-t2',
        name: 'Loop / Retro',
        category: 'Chronological Video/Photo',
        score: 87,
        reason: 'Privacy-first social app that uses chronological feeds without behavioral micro-targeting or in-app browser snooping.',
        advantages: ['No ad-tracking pixel network', 'Strict privacy-by-design policy', 'No biometric harvesting']
      }
    ]
  },
  'netflix': {
    id: 'netflix-tos-2026',
    companyName: 'Netflix',
    documentTitle: 'Terms of Use & Privacy Statement',
    sourceUrl: 'https://help.netflix.com/legal/termsofuse',
    analyzedDate: 'Aug 26, 2026',
    overallAssessment: 'Generally safe and straightforward, with clear refund rules and moderate device telemetry. Main cautions include strict household location enforcement and ad-tier partner tracking.',
    overallRiskLevel: 'safe',
    scores: {
      overall: 83,
      privacy: 78,
      security: 89,
      transparency: 86,
    },
    oneMinuteSummary: {
      headline: 'Subscription video streaming with clear billing terms, household geolocation enforcement, and ad-tier telemetry.',
      takeaways: [
        'Standard and Premium plans collect viewing habits for algorithmic recommendations and stream quality optimization.',
        'Ad-supported tiers share viewing demographics with advertising partners (Microsoft/Xandr).',
        'Enforces household location via IP address, device IDs, and Wi-Fi network checks.',
        'Subscriptions can be cancelled at any time with one click in account settings.'
      ],
      narrative: 'Netflix provides some of the clearest consumer terms in the tech industry. Billing is transparent, cancellation is painless, and data selling is strictly prohibited on ad-free tiers.'
    },
    dataPrivacy: {
      collectedData: [
        'Viewing history, playback timestamps, search queries, ratings, and device performance metrics',
        'IP addresses, device model identifiers, browser type, and home Wi-Fi network details',
        'Payment details and billing contact information via encrypted payment gateways'
      ],
      usagePractices: [
        'Serving personalized content recommendations and category carousels',
        'Detecting out-of-household account sharing',
        'Serving contextual or targeted ads on "Standard with Ads" subscription tiers'
      ],
      sharedWithThirdParties: true,
      thirdPartiesList: [
        'Ad technology partners (Microsoft Advertising) strictly for ad-supported tiers',
        'Content delivery networks (AWS, Netflix Open Connect)',
        'Payment processors and fraud prevention vendors'
      ],
      soldToBrokers: false,
      keyConcerns: [
        'Household location checks periodically log residential Wi-Fi network identifiers to prevent password sharing.'
      ]
    },
    refundsMoney: {
      refundPolicy: 'Payments are non-refundable and there are no refunds or credits for partially used membership periods.',
      cancellationConditions: 'You may cancel your Netflix membership at any time, and you will continue to have access to the service through the end of your billing period.',
      charges: '$6.99/mo (Standard with Ads), $15.49/mo (Standard), $22.99/mo (Premium). Extra member slots $7.99/mo.',
      hiddenCosts: ['Extra member monthly fee for users outside the primary household'],
      paymentClauses: ['Price changes are communicated with at least 30 days written email notice.'],
      isConcerning: false
    },
    autoRenewal: {
      hasAutoRenewal: true,
      renewalFrequency: 'Monthly on the calendar day corresponding to the commencement of your paying membership',
      cancellationNoticeWindow: 'Can cancel anytime before the next billing cycle begins',
      howToCancel: 'Account Page → Cancel Membership button (no phone calls or retention hurdles required)',
      deadlines: 'End of active monthly cycle',
      warningNotes: 'Account details and viewing profiles are preserved for 10 months after cancellation in case you choose to rejoin.'
    },
    userRights: {
      dataAccess: true,
      dataDeletion: true,
      accountDeletion: true,
      optOutRights: [
        'Opt-out of marketing communications and test features',
        'Opt-out of behavioral ad profiling on ad-supported plans'
      ],
      cancellationRights: 'One-click immediate online cancellation without penalty.',
      jurisdictionRights: ['Global support for GDPR, CCPA, and LGPD data export requests']
    },
    importantClauses: [
      {
        id: 'nf1',
        title: 'Household Geolocation Verification',
        riskLevel: 'caution',
        explanation: 'Netflix uses device IP addresses and network signatures to verify that all streaming devices belong to the same physical residence.',
        whyItMatters: 'Devices connecting from second homes or extended travel may require temporary travel codes or extra member fees.',
        originalSnippet: 'A Netflix account is meant to be shared by people living together in one household.',
        category: 'legal'
      },
      {
        id: 'nf2',
        title: 'No Retention Triggers on Cancellation',
        riskLevel: 'safe',
        explanation: 'Netflix does not hide the cancel button behind endless questionnaires, phone calls, or dark patterns.',
        whyItMatters: 'Sets a high standard for consumer-friendly cancellation UX.',
        category: 'financial'
      },
      {
        id: 'nf3',
        title: 'Arbitration and Jurisdiction Clauses',
        riskLevel: 'caution',
        explanation: 'Includes standard individual dispute resolution clauses for US subscribers.',
        whyItMatters: 'Limits collective class action litigation for billing claims.',
        category: 'legal'
      }
    ],
    cookiePolicy: {
      cookieTypes: [
        { name: 'NetflixId', purpose: 'User session authentication', isTracking: false },
        { name: 'SecureNetflixId', purpose: 'Secure encrypted credential token', isTracking: false },
        { name: 'memclid', purpose: 'Ad attribution on sign-up funnels', isTracking: true }
      ],
      purposes: ['Authentication', 'Remembering audio/subtitle preferences', 'Ad tier measurement'],
      trackingInformation: 'Does not use third-party cookies inside TV apps or dedicated smart player devices.',
      importantConcerns: ['Sign-up landing pages include marketing attribution pixels.']
    },
    relatedCases: [
      {
        id: 'nf-c1',
        title: 'Password Sharing Policy Rollout',
        description: 'Introduced primary location lock-in across 100+ countries in 2023, requiring devices to connect to home Wi-Fi every 31 days.',
        date: 'May 2023',
        relevance: 'Increased consumer attention on household IP tracking and device identity verification.'
      }
    ],
    policyChanges: [
      {
        id: 'nf-pc1',
        date: 'January 2026',
        version: 'v8.4',
        summary: 'Clarified generative AI asset rights and updated extra-member billing structures.',
        addedClauses: ['Refined international roaming travel authentication window.'],
        removedClauses: ['Legacy DVD mail-in service references.'],
        privacyImpact: 'positive'
      }
    ],
    trustTimeline: {
      trend: 'Stable',
      history: [
        { year: '2022', score: 82, status: 'stable', eventHighlight: 'Maintained strong GDPR compliance track record.' },
        { year: '2023', score: 79, status: 'declining', eventHighlight: 'Password sharing restrictions introduced household IP verification.' },
        { year: '2024', score: 81, status: 'improving', eventHighlight: 'Transparent ad-tier data handling disclosures with Microsoft.' },
        { year: '2025', score: 83, status: 'improving', eventHighlight: 'Fast automated privacy portal with instant download.' },
        { year: '2026', score: 83, status: 'stable', eventHighlight: 'Top tier consumer transparency rating.' }
      ]
    },
    alternatives: [
      {
        id: 'alt-nf1',
        name: 'MUBI',
        category: 'Curated Cinema',
        score: 92,
        reason: 'Independent cinema streaming service with zero ad-tracking tiers and minimal telemetry collection.',
        advantages: ['No password sharing household lockouts', 'No commercial advertising partners', 'Privacy-first European hosting']
      },
      {
        id: 'alt-nf2',
        name: 'Kanopy / Hoopla',
        category: 'Public Library Streaming',
        score: 98,
        reason: 'Free streaming supported by local public libraries and universities with strict library privacy protections.',
        advantages: ['100% free with library card', 'No credit card on file', 'Zero commercial monetization']
      }
    ]
  }
};

export const sampleSpotifyAnalysis = SAMPLE_ANALYSES['spotify'];
export const sampleDiscordAnalysis = SAMPLE_ANALYSES['discord'];
export const sampleTikTokAnalysis = SAMPLE_ANALYSES['tiktok'];
export const sampleNetflixAnalysis = SAMPLE_ANALYSES['netflix'];

