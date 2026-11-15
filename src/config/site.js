/**
 * ============================================================
 *  SITE CONFIG — the single place to edit content & assets.
 *  Everything here comes from the CV. Nothing is invented.
 * ============================================================
 */

export const person = {
  name: 'GUNANIDHI BHOJ',
  first: 'GUNANIDHI',
  last: 'BHOJ',
  role: 'DIRECTOR OF PHOTOGRAPHY',
  tagline: 'Capturing stories. Creating perspectives. Painting with light.',
  titles: ['Director of Photography', 'Cinematographer', 'Visual Storyteller'],
  phone: '+91 7999313761',
  phoneHref: 'tel:+917999313761',
  email: 'gunanidhi.bhoj048@gmail.com',
  location: 'Raipur, Chhattisgarh, India',
  education: 'Bachelor of Engineering (B.E.) — Electrical & Electronics Engineering',
};

/**
 * SHOWREEL — replace `src` with a real video file (put it in /public/media/)
 * or any hosted .mp4/.webm URL. When `src` is empty an original, generated
 * animated placeholder is shown instead (no copyrighted footage is used).
 */
export const showreel = {
  src: '', // e.g. '/media/showreel.mp4'
  poster: '', // e.g. '/media/showreel-poster.jpg'
};

/** SOCIAL LINKS — leave `url` empty to show a configurable placeholder. */
export const socials = [
  { id: 'instagram', label: 'Instagram', url: '' },
  { id: 'youtube', label: 'YouTube', url: '' },
  { id: 'vimeo', label: 'Vimeo', url: '' },
  { id: 'linkedin', label: 'LinkedIn', url: '' },
];

/**
 * CONTACT FORM — the form opens the visitor's mail app by default (mailto).
 * To post to a service instead (Formspree, Getform, your own API), set
 * `endpoint` to its URL.
 */
export const contactForm = {
  endpoint: '',
};

export const stats = [
  { value: 5, suffix: '+', label: 'YEARS EXPERIENCE' },
  { text: 'DOP', label: 'DIRECTOR OF PHOTOGRAPHY' },
  { text: 'CREATIVE', label: 'CREATIVE HEAD' },
  { text: 'TEAM', label: 'TEAM LEADER' },
];

export const aboutText = [
  'Director of Photography and cinematography professional with 5+ years of experience at Limelight Corp, working across government advertising, TVCs, event productions and visual storytelling.',
  'Experienced with Sony FX6 and FX3 cinema cameras, drone and 360-degree imaging equipment, camera and shot planning, cinematic lighting, and visual execution. Also leads creative teams, manages production coordination, and supports the visual execution of agency video projects.',
];

export const aboutPanels = [
  { tag: 'SECTOR', title: 'Government Advertising', body: 'TVCs, creative advertisements, promotional videos and campaign content for the Chhattisgarh State Government.' },
  { tag: 'FORMAT', title: 'Events & Storytelling', body: 'Event productions, state festivals and visual storytelling across India.' },
  { tag: 'ROLE', title: 'Lead + Operate', body: 'Leads video-shooting teams while handling cinematography, camera setups and lighting.' },
];

export const aboutTimeline = [
  { year: 'AUG 2021', label: 'Joins Limelight Corp as DOP, Creative Head & Team Leader' },
  { year: '2024', label: 'Jal Jagaar Event — Chhattisgarh State Government' },
  { year: '2025', label: 'Youth Ministry padyatras, Nasha Mukt Bharat, VBYLD, Rajyotsav' },
  { year: '2026', label: 'VBYLD, Raipur Sahitya Utsav, Sushasan Tihar' },
];

/**
 * PROJECTS — to replace visuals, set `thumbnail` (image) and `video` (mp4/webm)
 * for any project independently. Leave empty to keep the generated placeholder.
 * `hue` / `hue2` only tint the generated placeholder art.
 */
export const projects = [
  {
    id: 'sushasan-tihar',
    title: 'Sushasan Tihar',
    year: '2026',
    date: 'June 2026',
    client: 'Chhattisgarh State Government',
    category: 'Government event / video production',
    hue: 190, hue2: 280,
    thumbnail: '', video: '',
  },
  {
    id: 'vbyld-2026',
    title: 'VBYLD – Viksit Bharat Young Leaders’ Dialogue',
    year: '2026',
    date: 'January 2026',
    client: 'Bharat Mandapam, New Delhi',
    category: 'Event coverage',
    hue: 270, hue2: 330,
    thumbnail: '', video: '',
  },
  {
    id: 'raipur-sahitya-utsav',
    title: 'Raipur Sahitya Utsav',
    year: '2026',
    date: 'January 2026',
    client: 'Muktangan, Nava Raipur, Chhattisgarh',
    category: 'Event coverage',
    hue: 320, hue2: 200,
    thumbnail: '', video: '',
  },
  {
    id: 'chhattisgarh-rajyotsav',
    title: 'Chhattisgarh Rajyotsav',
    year: '2025',
    date: 'November 2025',
    client: 'Chhattisgarh',
    category: 'State festival / event coverage',
    hue: 350, hue2: 280,
    thumbnail: '', video: '',
  },
  {
    id: 'gujarat-padyatra',
    title: 'Gujarat Padyatra',
    year: '2025',
    date: 'November 2025',
    client: 'Youth Ministry',
    category: 'Padyatra coverage',
    hue: 175, hue2: 260,
    thumbnail: '', video: '',
  },
  {
    id: 'nasha-mukt-bharat',
    title: 'Nasha Mukt Bharat',
    year: '2025',
    date: 'July 2025',
    client: 'Youth Ministry',
    category: 'Awareness campaign',
    hue: 290, hue2: 190,
    thumbnail: '', video: '',
  },
  {
    id: 'punjab-padyatra',
    title: 'Punjab Padyatra',
    year: '2025',
    date: 'March 2025',
    client: 'Youth Ministry',
    category: 'Padyatra coverage',
    hue: 210, hue2: 310,
    thumbnail: '', video: '',
  },
  {
    id: 'pune-padyatra',
    title: 'Pune Padyatra',
    year: '2025',
    date: 'February 2025',
    client: 'Youth Ministry',
    category: 'Padyatra coverage',
    hue: 255, hue2: 345,
    thumbnail: '', video: '',
  },
  {
    id: 'vbyld-2025',
    title: 'VBYLD – Viksit Bharat Young Leaders’ Dialogue',
    year: '2025',
    date: 'January 2025',
    client: 'Bharat Mandapam, New Delhi',
    category: 'Event coverage',
    hue: 185, hue2: 300,
    thumbnail: '', video: '',
  },
  {
    id: 'jal-jagaar',
    title: 'Jal Jagaar Event',
    year: '2024',
    date: 'October 2024',
    client: 'Chhattisgarh State Government',
    category: 'Government event',
    hue: 200, hue2: 270,
    thumbnail: '', video: '',
  },
];

/**
 * EQUIPMENT — only the names from the CV. No specifications are listed on
 * purpose. Add `image` to swap the 3D placeholder with a photo, or `info`
 * lines once you have verified details you want to publish.
 */
export const equipment = [
  { id: 'fx6', group: 'CINEMA & HYBRID CAMERAS', name: 'Sony FX6', kind: 'camera', hue: 190, note: 'Cinema camera', info: [] , image: '' },
  { id: 'fx3', group: 'CINEMA & HYBRID CAMERAS', name: 'Sony FX3', kind: 'camera-small', hue: 280, note: 'Cinema / hybrid camera', info: [], image: '' },
  { id: 'dji', group: 'DRONE & 360°', name: 'DJI Drone', kind: 'drone', hue: 175, note: 'Aerial imaging', info: [], image: '' },
  { id: 'ag360', group: 'DRONE & 360°', name: 'Antigravity 360 Drone', kind: 'drone360', hue: 330, note: '360° aerial imaging', info: [], image: '' },
  { id: 'insta360', group: 'DRONE & 360°', name: 'Insta360', kind: 'sphere', hue: 260, note: '360° imaging', info: [], image: '' },
];

/** Skills — `group` drives the orbit ring. No proficiency numbers. */
export const skills = [
  { name: 'Cinematography', group: 'craft' },
  { name: 'Camera Operation', group: 'craft' },
  { name: 'Shot Composition', group: 'craft' },
  { name: 'Camera Movement', group: 'craft' },
  { name: 'Three-Point Lighting', group: 'light' },
  { name: 'Cinematic Lighting', group: 'light' },
  { name: 'Production Coordination', group: 'lead' },
  { name: 'Team Leadership', group: 'lead' },
  { name: 'Adobe Premiere Pro', group: 'post' },
  { name: 'Adobe After Effects', group: 'post' },
  { name: 'Adobe Photoshop', group: 'post' },
  { name: 'DaVinci Resolve', group: 'post' },
  { name: 'Hyperlapse Expert', group: 'post' },
];

export const skillGroups = {
  craft: { label: 'CAMERA CRAFT', color: '#00f0ff' },
  light: { label: 'LIGHT', color: '#a020ff' },
  lead: { label: 'PRODUCTION', color: '#ff2a55' },
  post: { label: 'POST & SOFTWARE', color: '#7cf7ff' },
};

export const experience = {
  company: 'LIMELIGHT CORP',
  position: 'Director of Photography | Creative Head | Team Leader',
  period: 'August 2021 – Present',
  responsibilities: [
    'Lead and manage teams for agency video-shooting and advertising projects.',
    'Coordinate shoot planning, production workflows, crew requirements and on-set execution.',
    'Handle cinematography and visual execution, including camera setups, shot composition and camera movement.',
    'Plan and execute three-point and cinematic lighting setups using professional lighting equipment.',
    'Work with cinema, hybrid, drone and 360-degree camera systems.',
  ],
  additional:
    'Regular video production work for the Chhattisgarh State Government, including TVCs, creative advertisements, promotional videos and campaign-related content. Additional project experience includes Youth Ministry video song production.',
};

export const navLinks = [
  { id: 'hero', label: 'HOME' },
  { id: 'showreel', label: 'REEL' },
  { id: 'about', label: 'ABOUT' },
  { id: 'projects', label: 'WORK' },
  { id: 'equipment', label: 'LAB' },
  { id: 'skills', label: 'SKILLS' },
  { id: 'experience', label: 'EXPERIENCE' },
  { id: 'contact', label: 'CONTACT' },
];
