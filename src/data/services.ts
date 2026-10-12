export type ServiceAccent = 'blue' | 'gold' | 'coral' | 'mint' | 'violet' | 'sky';

export interface ServiceBenefit {
  title: string;
  description: string;
  icon: string;
  accent: ServiceAccent;
}

export interface ServiceStep {
  title: string;
  description: string;
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServicePage {
  slug: string;
  path: string;
  shortTitle: string;
  eyebrow: string;
  title: string;
  seoTitle: string;
  description: string;
  lead: string;
  overviewTitle: string;
  overview: readonly string[];
  facts: readonly string[];
  benefits: readonly ServiceBenefit[];
  steps: readonly ServiceStep[];
  faqs: readonly ServiceFaq[];
  image: string;
  imageAlt: string;
  accent: ServiceAccent;
  related: readonly string[];
}

export const servicePages = [
  {
    slug: 'llc-formation',
    path: '/llc-formation/',
    shortTitle: 'LLC Formation',
    eyebrow: 'LLC formation',
    title: 'Form your Limited Liability Company.',
    seoTitle: 'LLC Formation Services | National Filing Corporation',
    description: 'Form an LLC with personal asset protection, flexible tax treatment, state-ready documents, and expert filing support from NFC.',
    lead: 'Launch with the most popular entity type in the United States—personal liability protection, flexible taxation, and a structure built around the way you work.',
    overviewTitle: 'Protection without unnecessary complexity.',
    overview: [
      'A Limited Liability Company separates your personal assets from company debts and obligations. For founders, freelancers, and real-estate investors, that legal separation is one of the clearest ways to protect what they have built outside the business.',
      'LLCs also keep operations flexible. Your Operating Agreement can define ownership, profit distribution, and decision-making without the board structure and formal meetings required of a corporation.',
      'By default, profits generally pass through to the owners’ tax returns. An eligible LLC may later elect S Corporation or C Corporation tax treatment when that better fits its financial plan.',
    ],
    facts: ['Personal asset protection', 'Pass-through taxation by default', 'Flexible management', 'Available in all 50 states'],
    benefits: [
      { title: 'Personal asset protection', description: 'Create a legal boundary between business obligations and your home, savings, and personal property.', icon: 'ph-shield-check', accent: 'blue' },
      { title: 'Tax flexibility', description: 'Begin with pass-through treatment and explore an S Corp or C Corp election when appropriate.', icon: 'ph-arrows-split', accent: 'gold' },
      { title: 'Simple compliance', description: 'Operate with fewer corporate formalities while keeping the core state requirements organized.', icon: 'ph-checks', accent: 'mint' },
      { title: 'All 50 states', description: 'We prepare the correct formation documents for the state where your company will operate.', icon: 'ph-map-trifold', accent: 'coral' },
      { title: 'Fast turnaround', description: 'Accurate preparation helps avoid preventable rejections and keeps your filing moving.', icon: 'ph-lightning', accent: 'violet' },
      { title: 'Operating Agreement', description: 'Receive a state-tailored template that documents member rights and responsibilities.', icon: 'ph-file-text', accent: 'sky' },
    ],
    steps: [
      { title: 'Select your state', description: 'See the requirements, state fee, and expected processing time before you begin.' },
      { title: 'Provide your details', description: 'Share your company name, registered agent, members, and management structure.' },
      { title: 'We file, you launch', description: 'We prepare and submit your formation package, then deliver the approved records.' },
    ],
    faqs: [
      { question: 'How long does it take to form an LLC?', answer: 'Processing time depends on the state and filing option. Florida LLC filings are often approved in one to three business days, while standard processing elsewhere can take longer. Expedited service is available in many states.' },
      { question: 'Do I need an Operating Agreement?', answer: 'Not every state requires one, but it is an important record of member roles, ownership, profit sharing, and internal procedures. Banks may also request it when opening an account.' },
      { question: 'Can one person form an LLC?', answer: 'Yes. A single-member LLC can receive the same liability protection as a multi-member LLC and is generally treated as a disregarded entity for federal tax purposes unless another election is made.' },
      { question: 'How is an LLC different from a corporation?', answer: 'An LLC usually offers more management and tax flexibility with fewer formalities. A corporation uses directors, officers, shares, meetings, and stricter record-keeping, which can be preferable for companies pursuing institutional investment.' },
      { question: 'How much does LLC formation cost?', answer: 'State fees vary widely and are separate from the NFC service fee. Review the pricing page and your selected state before filing.' },
    ],
    image: '/media/services/llc-formation-hero.jpg',
    imageAlt: 'A founder organizing a new LLC formation package in an NFC filing studio',
    accent: 'blue',
    related: ['s-corporation', 'registered-agent', 'business-renewal'],
  },
  {
    slug: 'c-corporation',
    path: '/c-corporation/',
    shortTitle: 'C Corporation',
    eyebrow: 'C corporation',
    title: 'Incorporate for ambitious growth.',
    seoTitle: 'C Corporation Formation | National Filing Corporation',
    description: 'Form a C Corporation with investor-ready documents, a defined share structure, and expert state filing support from NFC.',
    lead: 'Build a company designed to issue stock, attract investment, and continue beyond changes in ownership—with the structure serious growth requires.',
    overviewTitle: 'A clear structure for capital and scale.',
    overview: [
      'A C Corporation is a legal entity and taxpayer separate from its shareholders. It can own property, enter contracts, issue shares, and continue operating as ownership changes.',
      'Shareholders elect a board of directors, and the board appoints officers to operate the company. Those clear lines of authority are familiar to banks, partners, and institutional investors.',
      'C Corporations can issue multiple classes of stock. That flexibility is a central reason venture-backed companies often choose this structure, even though corporate profits and shareholder dividends can be taxed separately.',
    ],
    facts: ['Multiple classes of stock', 'Unlimited shareholders', 'Perpetual existence', 'Investor-ready governance'],
    benefits: [
      { title: 'Investor-ready', description: 'Issue common stock, preferred stock, and options with a structure investors recognize.', icon: 'ph-chart-line-up', accent: 'coral' },
      { title: 'Liability shield', description: 'Keep shareholder assets separate when corporate formalities and finances are maintained.', icon: 'ph-shield-chevron', accent: 'blue' },
      { title: 'Perpetual existence', description: 'Ownership can change through stock transfers without ending the corporation.', icon: 'ph-infinity', accent: 'violet' },
      { title: 'Credible structure', description: 'An incorporated entity can support larger contracts, bids, and partnership requirements.', icon: 'ph-buildings', accent: 'gold' },
      { title: 'Tax planning options', description: 'A separate taxpayer can retain earnings and offer deductible benefits under current rules.', icon: 'ph-calculator', accent: 'mint' },
      { title: 'Complete records', description: 'Start with articles, bylaws, resolutions, and stock records prepared as one coherent package.', icon: 'ph-files', accent: 'sky' },
    ],
    steps: [
      { title: 'Choose your state', description: 'Compare your home state with options such as Delaware based on how you plan to operate and fund the company.' },
      { title: 'Define the company', description: 'Provide the name, directors, officers, registered agent, share structure, and business purpose.' },
      { title: 'Receive your records', description: 'After approval, receive your incorporation documents and the records needed to organize the company.' },
    ],
    faqs: [
      { question: 'What is double taxation?', answer: 'The corporation pays tax on its profits, and shareholders may pay tax on dividends. Companies can plan around this by reinvesting earnings, paying reasonable compensation, and using eligible benefits with professional tax guidance.' },
      { question: 'Should I incorporate in Delaware or my home state?', answer: 'Delaware is attractive to many venture-backed companies because of its established corporate law. A company operating in one state without outside funding may find its home state simpler and less expensive.' },
      { question: 'How many shareholders can a C Corporation have?', answer: 'There is no federal limit. Individuals, entities, trusts, and eligible foreign owners may hold shares, subject to applicable law and company documents.' },
      { question: 'What formalities must a corporation maintain?', answer: 'Corporations generally need meetings or written consents, minutes, a stock ledger, annual state filings, and finances that remain separate from those of shareholders.' },
      { question: 'How is a C Corp different from an S Corp?', answer: 'A C Corp pays tax at the corporate level and has few ownership restrictions. An S Corp is a tax election with pass-through treatment, ownership limits, and one permitted class of stock.' },
    ],
    image: '/media/services/c-corporation-hero.jpg',
    imageAlt: 'An investor-ready corporate record book and share documents arranged in an NFC studio',
    accent: 'coral',
    related: ['s-corporation', 'llc-formation', 'registered-agent'],
  },
  {
    slug: 's-corporation',
    path: '/s-corporation/',
    shortTitle: 'S Corporation',
    eyebrow: 'S corporation election',
    title: 'Elect smarter tax treatment.',
    seoTitle: 'S Corporation Election & Filing | National Filing Corporation',
    description: 'Prepare an S Corporation election with Form 2553 support, eligibility review, state compliance guidance, and clear next steps.',
    lead: 'Combine corporate liability protection with pass-through taxation and a compensation structure that may reduce self-employment tax for an eligible business.',
    overviewTitle: 'A tax election, not a separate entity.',
    overview: [
      'An S Corporation is a federal tax election available to eligible U.S. corporations and LLCs. Business income generally passes through to shareholders instead of being taxed first at the corporate level.',
      'A shareholder-employee receives reasonable compensation through payroll. Remaining eligible profits may be distributed differently for employment-tax purposes, which can produce savings as income grows.',
      'Eligibility matters: the business must be domestic, generally have no more than 100 qualifying shareholders, and issue only one class of stock. Timing matters too because Form 2553 has filing deadlines.',
    ],
    facts: ['Pass-through taxation', 'Form 2553 preparation', 'Up to 100 shareholders', 'One class of stock'],
    benefits: [
      { title: 'Potential tax savings', description: 'Separate reasonable salary from eligible distributions under an informed compensation plan.', icon: 'ph-piggy-bank', accent: 'gold' },
      { title: 'Single-level taxation', description: 'Federal income generally passes through to shareholders instead of being taxed twice.', icon: 'ph-arrow-circle-down', accent: 'mint' },
      { title: 'Liability protection', description: 'Keep the underlying LLC or corporation’s legal separation while changing tax treatment.', icon: 'ph-shield-check', accent: 'blue' },
      { title: 'Form 2553 support', description: 'Prepare the election and required shareholder consents accurately and on time.', icon: 'ph-file-arrow-up', accent: 'coral' },
      { title: 'State coordination', description: 'Identify state-level elections or filings that may accompany the federal election.', icon: 'ph-map-pin-line', accent: 'violet' },
      { title: 'Clear handoff', description: 'Receive a practical checklist for payroll, distributions, and recurring filings.', icon: 'ph-list-checks', accent: 'sky' },
    ],
    steps: [
      { title: 'Confirm your entity', description: 'Use an existing eligible LLC or corporation, or form the underlying entity first.' },
      { title: 'Prepare Form 2553', description: 'We organize company details and shareholder consents for the federal election.' },
      { title: 'Set up the next steps', description: 'After acceptance, coordinate payroll, distributions, and recurring tax filings with your advisers.' },
    ],
    faqs: [
      { question: 'When should I consider S Corp status?', answer: 'The election often becomes worth evaluating when recurring net income is high enough for potential employment-tax savings to exceed payroll and compliance costs. A tax professional should model the decision for your circumstances.' },
      { question: 'What is a reasonable salary?', answer: 'The IRS expects compensation comparable to the work performed. Duties, experience, time, location, and industry pay all matter; an artificially low salary can create audit risk.' },
      { question: 'Can an LLC elect S Corp status?', answer: 'Yes, if it meets the eligibility rules. The company can keep its LLC legal structure while electing S Corporation treatment for federal tax purposes.' },
      { question: 'What if the Form 2553 deadline passed?', answer: 'Late-election relief may be available when the business meets the requirements and can show reasonable cause. Eligibility should be reviewed before filing.' },
      { question: 'What are the limitations?', answer: 'S Corporations face shareholder residency and count limits, one-class-of-stock rules, and payroll obligations for shareholder-employees. A C Corp may be better for venture funding or international ownership.' },
    ],
    image: '/media/services/s-corporation-hero.jpg',
    imageAlt: 'A carefully prepared S Corporation election and payroll planning workspace',
    accent: 'gold',
    related: ['llc-formation', 'c-corporation', 'business-renewal'],
  },
  {
    slug: 'nonprofit-organization',
    path: '/nonprofit-organization/',
    shortTitle: 'Nonprofit',
    eyebrow: 'Nonprofit organization',
    title: 'Give your mission a legal foundation.',
    seoTitle: 'Nonprofit Formation & 501(c)(3) Support | NFC',
    description: 'Start a nonprofit with state incorporation, governance documents, 501(c)(3) application support, and an organized compliance handoff.',
    lead: 'Turn a charitable, educational, religious, scientific, or public-interest mission into an organization built to earn trust and pursue tax-exempt status.',
    overviewTitle: 'Structure that helps a mission endure.',
    overview: [
      'A nonprofit is formed to advance a defined mission rather than distribute profits to owners. It begins as a state corporation with its own directors, governing documents, and public purpose.',
      'State incorporation does not automatically create federal tax exemption. Most charitable organizations separately apply to the IRS for recognition under Section 501(c)(3), using Form 1023 or, when eligible, Form 1023-EZ.',
      'The right foundation supports grant eligibility, donor confidence, and responsible governance. It also creates recurring obligations, including annual federal and state filings.',
    ],
    facts: ['State incorporation', 'Governance documents', '501(c)(3) application support', 'Compliance roadmap'],
    benefits: [
      { title: 'Formation package', description: 'Prepare purpose language, articles, bylaws, and initial resolutions as a coordinated set.', icon: 'ph-folder-open', accent: 'violet' },
      { title: '501(c)(3) support', description: 'Organize the information required for the appropriate federal exemption application.', icon: 'ph-seal-check', accent: 'blue' },
      { title: 'Grant readiness', description: 'Build the legal foundation many private and public funding programs expect.', icon: 'ph-hand-heart', accent: 'coral' },
      { title: 'Donor confidence', description: 'Document governance and purpose clearly so supporters understand how the mission is managed.', icon: 'ph-heart', accent: 'gold' },
      { title: 'State compliance', description: 'Identify charitable registration and recurring filing requirements that may apply.', icon: 'ph-map-trifold', accent: 'mint' },
      { title: 'Ongoing guidance', description: 'Receive a practical handoff for annual reports, Form 990, records, and board actions.', icon: 'ph-compass', accent: 'sky' },
    ],
    steps: [
      { title: 'Incorporate in your state', description: 'Define the mission, directors, registered agent, and legally compliant purpose language.' },
      { title: 'Apply for exemption', description: 'Prepare the appropriate Form 1023 application and supporting organizational records.' },
      { title: 'Launch the mission', description: 'Receive your governance documents and a roadmap for fundraising and annual compliance.' },
    ],
    faqs: [
      { question: 'How long does 501(c)(3) recognition take?', answer: 'Timing depends on the application type and IRS review. Form 1023-EZ is often faster, while the full Form 1023 may take several months or require follow-up information.' },
      { question: 'Can a nonprofit pay employees?', answer: 'Yes. A nonprofit may pay reasonable compensation for services, but its earnings cannot be distributed to private owners or insiders.' },
      { question: 'What is the difference between Form 1023 and 1023-EZ?', answer: 'Form 1023 is the full application. Form 1023-EZ is a streamlined option available only to organizations that satisfy the IRS eligibility worksheet and size requirements.' },
      { question: 'Do I need a board of directors?', answer: 'Yes. State law establishes the required number and responsibilities. Independent directors also strengthen governance and public confidence.' },
      { question: 'What ongoing filings are required?', answer: 'Most organizations file an annual Form 990-series return, state annual reports, and any required charitable solicitation renewals. Requirements vary by size, activity, and state.' },
    ],
    image: '/media/services/nonprofit-organization-hero.jpg',
    imageAlt: 'A community organization planning its nonprofit filing and mission documents',
    accent: 'violet',
    related: ['registered-agent', 'business-renewal', 'llc-formation'],
  },
  {
    slug: 'business-renewal',
    path: '/business-renewal/',
    shortTitle: 'Business Renewal',
    eyebrow: 'Business renewal',
    title: 'Keep your business in good standing.',
    seoTitle: 'Business Renewal & Annual Reports | NFC',
    description: 'Track deadlines, prepare annual reports, renew registered agent service, and keep your business in good standing with NFC.',
    lead: 'Stay ahead of annual reports, state renewals, and compliance dates with a filing process designed to prevent avoidable penalties and administrative dissolution.',
    overviewTitle: 'Good standing is an ongoing job.',
    overview: [
      'Most states require LLCs and corporations to update company information and pay a filing fee on a recurring schedule. The filing may be called an annual report, biennial report, statement of information, or franchise-tax report.',
      'Missing a deadline can trigger late fees, loss of good standing, or administrative dissolution. Those problems can interrupt banking, contracts, financing, and expansion into another state.',
      'NFC tracks the applicable due date, prepares the correct state filing, and keeps the supporting confirmation organized with your company records.',
    ],
    facts: ['Deadline tracking', 'Annual report preparation', 'Multi-state support', 'Reinstatement guidance'],
    benefits: [
      { title: 'Deadline tracking', description: 'Know what is due, where it must be filed, and when action is required.', icon: 'ph-calendar-check', accent: 'mint' },
      { title: 'On-time filing', description: 'Prepare recurring reports accurately to reduce late fees and unnecessary status problems.', icon: 'ph-clock-countdown', accent: 'blue' },
      { title: 'Agent renewal', description: 'Coordinate registered agent coverage with the company’s broader renewal calendar.', icon: 'ph-user-focus', accent: 'coral' },
      { title: 'Multi-state support', description: 'Organize requirements for entities registered in more than one jurisdiction.', icon: 'ph-globe-hemisphere-west', accent: 'violet' },
      { title: 'Reinstatement help', description: 'Map the filings and payments commonly needed when an entity has fallen out of good standing.', icon: 'ph-arrow-counter-clockwise', accent: 'gold' },
      { title: 'Clear records', description: 'Keep confirmations and filed reports together for banking, contracts, and due diligence.', icon: 'ph-archive-tray', accent: 'sky' },
    ],
    steps: [
      { title: 'Tell us about the entity', description: 'Share its state, current status, registration details, and any notices received.' },
      { title: 'We prepare the filing', description: 'We confirm the requirement, organize current information, and prepare the report.' },
      { title: 'Stay in good standing', description: 'Receive filing confirmation and a clear record of the next expected compliance date.' },
    ],
    faqs: [
      { question: 'What happens if I miss an annual report?', answer: 'The state may charge late fees, mark the entity delinquent, or administratively dissolve it. Acting quickly can often limit the cost and complexity of reinstatement.' },
      { question: 'How much does an annual report cost?', answer: 'Government fees vary by state and entity type. NFC confirms the applicable state fee before the filing is submitted.' },
      { question: 'Do I need to renew my registered agent?', answer: 'The company must continuously maintain an eligible registered agent in each state where it is registered. Service arrangements and state filings should be kept current.' },
      { question: 'What if my business was already dissolved?', answer: 'Reinstatement may be available after overdue reports, fees, taxes, or agent issues are resolved. The exact process depends on the state and how long the entity has been inactive.' },
      { question: 'Do LLCs and corporations renew differently?', answer: 'Requirements and due dates can differ by state and entity type. NFC checks the company’s specific record instead of applying a one-size-fits-all calendar.' },
    ],
    image: '/media/services/business-renewal-hero.jpg',
    imageAlt: 'A precise annual compliance calendar with completed business renewal records',
    accent: 'mint',
    related: ['registered-agent', 'llc-formation', 'c-corporation'],
  },
  {
    slug: 'registered-agent',
    path: '/registered-agent/',
    shortTitle: 'Registered Agent',
    eyebrow: 'Registered agent',
    title: 'Never miss an official notice.',
    seoTitle: 'Registered Agent Service | National Filing Corporation',
    description: 'Professional registered agent service with reliable document handling, privacy support, compliance alerts, and multi-state coverage.',
    lead: 'Maintain a dependable public contact for legal and government correspondence while keeping sensitive documents organized and your team informed.',
    overviewTitle: 'A reliable point of contact, every business day.',
    overview: [
      'A registered agent is the person or company designated to receive service of process, tax notices, and official state correspondence for an entity.',
      'The agent must maintain a physical address in the state and be available during regular business hours. Missing an important notice can lead to default judgments, penalties, or loss of good standing.',
      'Professional service gives the business a consistent public address, prompt document handling, and continuity when owners travel, relocate, or operate across multiple states.',
    ],
    facts: ['Reliable document receipt', 'Business-hours coverage', 'Privacy support', 'Nationwide coordination'],
    benefits: [
      { title: 'Privacy protection', description: 'Use a professional public address instead of placing a home address on state records where permitted.', icon: 'ph-eye-slash', accent: 'blue' },
      { title: 'Document handling', description: 'Receive prompt notice when legal or official correspondence arrives.', icon: 'ph-envelope-open', accent: 'coral' },
      { title: 'Nationwide coverage', description: 'Coordinate registered agent needs as the company qualifies in additional states.', icon: 'ph-map-pin-area', accent: 'mint' },
      { title: 'Compliance alerts', description: 'Connect important notices and filing dates to a practical action list.', icon: 'ph-bell-ringing', accent: 'gold' },
      { title: 'Easy agent change', description: 'Prepare the state designation when moving from an owner or another provider to NFC.', icon: 'ph-arrows-left-right', accent: 'violet' },
      { title: 'Straightforward fee', description: 'Understand the annual service price and any separate state change fee before proceeding.', icon: 'ph-receipt', accent: 'sky' },
    ],
    steps: [
      { title: 'Select your states', description: 'Tell us where the entity is formed and every state where it is registered to do business.' },
      { title: 'Designate NFC', description: 'We prepare the formation or change-of-agent filing required by the state.' },
      { title: 'Receive notifications', description: 'When official documents arrive, your business receives a prompt, organized notice.' },
    ],
    faqs: [
      { question: 'Can I be my own registered agent?', answer: 'Often yes, if you meet the state’s address and availability rules. Doing so may place your address in public records and requires you to be reliably available during business hours.' },
      { question: 'What documents does a registered agent receive?', answer: 'Common items include service of process, state notices, tax correspondence, annual-report reminders, and other official government mail.' },
      { question: 'What happens without a registered agent?', answer: 'The state can reject a filing, assess penalties, revoke good standing, or dissolve the entity. The company may also miss legal notices and important deadlines.' },
      { question: 'How do I switch agents?', answer: 'A change form is filed with the state, sometimes with a fee or the new agent’s consent. NFC can prepare the designation as part of onboarding.' },
      { question: 'Is registered agent service included with formation?', answer: 'Availability depends on the selected package and state. The pricing and intake pages show what is included before checkout.' },
    ],
    image: '/media/services/registered-agent-hero.jpg',
    imageAlt: 'A registered agent receiving and organizing an official certified notice',
    accent: 'coral',
    related: ['business-renewal', 'llc-formation', 'nonprofit-organization'],
  },
] as const satisfies readonly ServicePage[];

export const serviceBySlug = Object.fromEntries(
  servicePages.map((service) => [service.slug, service]),
) as Record<string, ServicePage>;

export const indexedServicePaths = servicePages.map((service) => service.path);
