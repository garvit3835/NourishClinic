import React, {useState, useEffect} from 'react'

export default function Clients() {
  const [clients, setClients] = useState([])

  useEffect(() => {
    fetch('http://localhost:5000/api/clients/get')
      .then((res) => res.json())
      .then((data) => setClients(data))
  }, [])

  console.log(clients)

  const monthDiff = (d1: Date, d2: Date) => {
    let months = (d2.getFullYear() - d1.getFullYear()) * 12
    months -= d1.getMonth()
    months += d2.getMonth()
    return months <= 0 ? 'Expired' : `${months}M`
  }

  return (
    <table className='table table-bordered'>
      <thead>
        <tr>
          <th className='fs-3 text-center'>Report Status</th>
          <th className='fs-3 text-center'>Select if completed</th>
          <th className='fs-3 text-center'>Name/Number</th>
          <th className='fs-3 text-center'>Email</th>
          <th className='fs-3 text-center'>Gender</th>
          <th className='fs-3 text-center'>Age</th>
          <th className='fs-3 text-center'>Regsitration Date</th>
          <th className='fs-3 text-center'>Expiry Date</th>
          <th className='fs-3 text-center'>Validity</th>
          <th className='fs-3 text-center'>Valid/ Blacklisted</th>
          <th className='fs-3 text-center'>Payment Status</th>
          <th className='fs-3 text-center'>Update Package/Profile</th>
        </tr>
      </thead>
      <tbody>
        {clients &&
          clients.map((client: any, i) => {
            let expiryDate = new Date(
              new Date(client.registerDate).setMonth(
                new Date(client.registerDate).getMonth() + client.package
              )
            )
            let registerDate = new Date(client.registerDate)
            let validity = monthDiff(new Date(), expiryDate)
            return (
              <tr key={i}>
                <td className='fs-3'>
                  {client.reportStatus === 0
                    ? 'Pending'
                    : client.reportStatus === 1
                    ? 'Incomplete'
                    : 'Complete'}
                </td>
                <td className='fs-3'>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      role='switch'
                      id='flexSwitchCheckDefault'
                    />
                    <label className='form-check-label' htmlFor='flexSwitchCheckDefault'>
                      Blood Report
                    </label>
                  </div>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      role='switch'
                      id='flexSwitchCheckDefault'
                    />
                    <label className='form-check-label' htmlFor='flexSwitchCheckDefault'>
                      Weight Check
                    </label>
                  </div>
                </td>
                <td className='fs-3'>
                  {client.name}
                  <br />
                  {client.mobile}
                </td>
                <td className='fs-3'>{client.email}</td>
                <td className='fs-3'>{client.gender}</td>
                <td className='fs-3'>{client.age}</td>
                <td className='fs-3'>{registerDate.toLocaleDateString()}</td>
                <td className='fs-3'>{expiryDate.toLocaleDateString()}</td>
                <td className='fs-3'>{validity}</td>
                <td className='fs-3'>{client.isBlacklisted ? 'Blacklisted' : 'Valid'}</td>
                <td className='fs-3'></td>
                <td className='fs-3'>
                  <button type='button' className='btn btn-primary px-12'>
                    Update
                  </button>
                </td>
              </tr>
            )
          })}
      </tbody>
    </table>
  )
}
