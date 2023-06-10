/* eslint-disable react/jsx-no-target-blank */
import {useIntl} from 'react-intl'
import {AsideMenuItemWithSubMain} from './AsideMenuItemWithSubMain'
import {AsideMenuItemWithSub} from './AsideMenuItemWithSub'
import {AsideMenuItem} from './AsideMenuItem'

export function AsideMenuMain() {
  const intl = useIntl()
  return (
    <>
      {/* <AsideMenuItem
        to='/dashboard'
        title="Home"
        fontIcon='bi-house fs-2'
        bsTitle={intl.formatMessage({id: 'MENU.DASHBOARD'})}
        className='py-2'
      /> */}
      <AsideMenuItem to="/calender" title="Calender" />
      <AsideMenuItem to="/createAppointment" title="Create an Appointment" />
      <AsideMenuItem to="/dailyAppointments" title="Daily Appointments" />
      <AsideMenuItem to="/clients" title="Clients" />
      <AsideMenuItem to="/registerClients" title="Register Clients" />
    </>
  )
}
