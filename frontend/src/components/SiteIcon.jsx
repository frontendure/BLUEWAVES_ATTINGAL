import {
  FiAperture,
  FiCalendar,
  FiCamera,
  FiCheckCircle,
  FiClock,
  FiCompass,
  FiCreditCard,
  FiDroplet,
  FiGrid,
  FiHeart,
  FiHome,
  FiImage,
  FiLock,
  FiMail,
  FiMapPin,
  FiMessageCircle,
  FiMusic,
  FiPhone,
  FiShield,
  FiSun,
  FiTag,
  FiUsers,
  FiWind,
} from 'react-icons/fi'

export function IconBadge({ icon: Icon, className = '' }) {
  return (
    <span className={className} aria-hidden="true">
      <Icon />
    </span>
  )
}

export const siteIcons = {
  hero: FiImage,
  pool: FiDroplet,
  yoga: FiSun,
  zumba: FiMusic,
  water: FiDroplet,
  lab: FiAperture,
  changing: FiShield,
  deck: FiGrid,
  locker: FiLock,
  shower: FiWind,
  firstAid: FiHeart,
  spectators: FiUsers,
  parking: FiMapPin,
  calendar: FiCalendar,
  coaching: FiCompass,
  clean: FiDroplet,
  wellness: FiSun,
  facilities: FiHome,
  training: FiClock,
  general: FiCamera,
  fees: FiCreditCard,
  ticket: FiTag,
  location: FiMapPin,
  phone: FiPhone,
  email: FiMail,
  chat: FiMessageCircle,
  success: FiCheckCircle,
}
