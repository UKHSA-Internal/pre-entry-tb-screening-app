'use client'
import { useState, useEffect } from 'react'
import ClinicInterface from "@model/interface/clinic";

export default function ClinicDashboard() {
  const [data, setData] = useState<any>(null)
  const [isLoading, setLoading] = useState(true)
 
  useEffect(() => {
    fetch('http://localhost:3004/dev/clinics')
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setData(data)
        setLoading(false)
      })
  }, [])

  
  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No clinic data</p>
 
  return (
    <div className="govuk-!-padding-right-9 govuk-!-padding-left-9">
      <table className="govuk-table">
      <caption className="govuk-table__caption govuk-table__caption--m">PETs Clinic Detail</caption>
      <thead className="govuk-table__head">
          <tr className="govuk-table__row">
            <th scope="col" className="govuk-table__header">Key</th>
            <th scope="col" className="govuk-table__header">Data</th>
          </tr>
      </thead>
      {data.map((clinic: ClinicInterface) => 
        (<tbody className="govuk-table__body" key={clinic.petsClinicId}>
          <tr className="govuk-table__row">
            <th scope="row" className="govuk-table__header">Clinic ID</th>
            <td className="govuk-table__cell">{clinic.petsClinicId}</td>
          </tr>
          <tr className="govuk-table__row">
            <th scope="row" className="govuk-table__header">Clinic Name</th>
            <td className="govuk-table__cell">{clinic.petsClinicName}</td>
          </tr>
          <tr className="govuk-table__row">
            <th scope="row" className="govuk-table__header">Clinic Status</th>
            <td className="govuk-table__cell">{clinic.petsClinicStatus}</td>
          </tr>
          <tr className="govuk-table__row">
            <th scope="row" className="govuk-table__header">Clinic State/Town</th>
            <td className="govuk-table__cell">{clinic.petsClinicTown}</td>
          </tr>
          <tr className="govuk-table__row">
            <th scope="row" className="govuk-table__header">Clinic Country</th>
            <td className="govuk-table__cell">{clinic.petsClinicCountry}</td>
          </tr>
          <br/>
        </tbody>)
      )}
      </table>
      <button type="submit" className="govuk-button" data-module="govuk-button">
        Edit Clinic Details
      </button>
    </div>
  )
}
