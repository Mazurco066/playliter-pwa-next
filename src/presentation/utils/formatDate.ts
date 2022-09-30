export const formatDate = (value: string, short: boolean = true) : string => {
  return short
    ? value.split('T')[0].split('-').reverse().join('/')
    : `${value.split('T')[0].split('-').reverse().join('/')} ${value.split('T')[1]}`
}
