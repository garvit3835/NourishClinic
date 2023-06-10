import React, {useState, useEffect} from 'react'
import {Page, Text, View, Document, StyleSheet, PDFViewer} from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
    width: 500,
    height: 500,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
})

export default function Bill() {
  const [name, setName] = useState<any>()
  const [date, setDate] = useState<any>()
  const [payStatus, setPayStatus] = useState<any>()
  const [timeSlot, setTimeSlot] = useState<any>()
  const [amount, setAmount] = useState<any>()
  useEffect(() => {
    // Get the query parameters from the URL
    const searchParams = new URLSearchParams(window.location.search)

    // Access the props using the get() method
    setName(searchParams.get('name'))
    setDate(searchParams.get('date'))
    setPayStatus(searchParams.get('payStatus'))
    setTimeSlot(searchParams.get('timeSlot'))
    setAmount(searchParams.get('amount'))
  }, [])

  return (
    <div style={{width: '100%', height: '100%'}} className='overflow-hidden'>
      <PDFViewer style={{width: '100%', height: '100%'}}>
        <Document>
          <Page size='A5' style={styles.page}>
            <View style={styles.section}>
              <Text style={{fontWeight: 'bold'}}>NourishGenie</Text>
              <Text> </Text>
              <Text>Name: {name}</Text>
              <Text>Date: {date}</Text>
              <Text>Time-Slot: {timeSlot}</Text>
              <Text>Payment Amount: {amount}</Text>
              <Text>Payment Status: {payStatus}</Text>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </div>
  )
}
