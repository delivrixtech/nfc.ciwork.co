export const links = {
  formation: '/business-formation/',
  services: '/services/',
  states: '/browse-by-state/',
  pricing: '/pricing/',
  terms: '/terms-and-conditions/',
  privacy: '/privacy-policy/',
  email: 'mailto:info@nationalfilingcorporation.com',
  phone: 'tel:+17684752846',
} as const;

export const services = [
  {
    title: 'Fast Processing',
    description: 'Get your business formation documents filed in as little as 24 hours.',
    image: '/media/icon-fast-processing.png',
    accent: 'blue',
  },
  {
    title: '100% Accuracy',
    description: 'Our experts ensure error-free filing with state agencies.',
    image: '/media/icon-accuracy.png',
    accent: 'gold',
  },
  {
    title: 'Expert Support',
    description: 'Dedicated specialists guide you through every step of the process.',
    image: '/media/icon-support.png',
    accent: 'mint',
  },
  {
    title: 'Trusted Service',
    description: 'Over 300,000 businesses formed with 4.9/5 customer satisfaction.',
    image: '/media/icon-security.png',
    accent: 'violet',
  },
] as const;

export const tickerItems = [
  '300K+ businesses formed',
  '4.9 customer rating',
  '24hr average processing',
  'Expert-prepared filings',
  'Clear, upfront pricing',
] as const;

export const processSteps = [
  {
    number: '01',
    title: 'Complete our simple form',
    description:
      'Tell us your business name, structure, and ownership details in one simple guided form.',
    result: 'Form submitted and reviewed',
    time: 'Day 0',
  },
  {
    number: '02',
    title: 'We prepare and file everything',
    description:
      'Our specialists prepare and submit your documents directly to your state, checking every detail first.',
    result: 'Documents filed with your state',
    time: '24 hrs',
  },
  {
    number: '03',
    title: 'Receive your documents',
    description:
      'Get your approved formation records, EIN, and a clear compliance handoff.',
    result: 'All documents delivered',
    time: '2–5 days',
  },
] as const;

export const plans = [
  {
    name: 'Basic Filing',
    description: 'The key elements to launch your business swiftly and effectively.',
    price: '599',
    featured: false,
    features: ['New Entity Formation', 'Formation document review'],
    href: `${links.formation}?plan=Basic+Filing`,
  },
  {
    name: 'Essential Filing',
    description: 'Our all-in-one solution to get your business running with expert guidance.',
    price: '899',
    featured: true,
    features: [
      '30-minute personalized consultation',
      'New Entity Formation',
      'Tax ID (EIN) Filing',
      'Personalized compliance roadmap',
    ],
    href: `${links.formation}?plan=Essential+Filing`,
  },
  {
    name: 'Foreign Entity BOI Review',
    description: 'Eligibility review and filing support for foreign entities that may still be required to report.',
    price: '199',
    featured: false,
    features: [
      'Current-rule eligibility review',
      'Foreign reporting company assessment',
      'Filing assistance when required',
      'Confirmation and records support',
    ],
    href: `${links.formation}?plan=Foreign+Entity+BOI+Review`,
  },
  {
    name: 'Registered Agent',
    description: 'Your designated agent for state compliance and document handling.',
    price: '99',
    featured: false,
    features: ['Compliance deadline tracking', 'Document delivery and confirmation'],
    href: '/registered-agent/',
  },
] as const;

export const faqs = [
  {
    question: 'Why file with us?',
    answer:
      'NFC combines accurate expert preparation, transparent pricing, complete formation support, and real human guidance. We manage the paperwork, filing, and submissions so you can focus on the business itself.',
  },
  {
    question: 'What makes NFC different?',
    answer:
      'You get technology without losing the human touch. Our professionals tailor the process to your business, explain what is happening, and keep the full formation journey in one place.',
  },
  {
    question: 'Why use a professional filing service?',
    answer:
      'State and federal requirements can be time-consuming and small errors can create delays or penalties. Expert preparation reduces that risk while giving you a clear path from application to approved documents.',
  },
  {
    question: 'What is a Beneficial Ownership Information Report?',
    answer:
      'A BOI report identifies certain foreign individuals who own or control a qualifying foreign reporting company. Under FinCEN’s rule effective August 11, 2026, companies created in the United States are exempt; only certain foreign entities registered to do business in the U.S. may still need to report. NFC can review eligibility and assist when a filing is required.',
  },
  {
    question: 'What is a beneficial owner?',
    answer:
      'For an entity that remains subject to BOI reporting, a beneficial owner is generally an individual who exercises substantial control or owns or controls at least 25 percent of its ownership interests. Current FinCEN rules exclude U.S. persons from the information those reporting companies submit.',
  },
  {
    question: 'What if I have more questions?',
    answer:
      'Call (768) 475-2846 or email info@nationalfilingcorporation.com. A member of the NFC team can help you understand the next step for your filing.',
  },
] as const;

export const states = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois',
  'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts',
  'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
  'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming',
] as const;
