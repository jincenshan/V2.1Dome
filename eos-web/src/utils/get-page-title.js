// import defaultSettings from '@/settings'
const title = '氧调平台系统管理'


export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
