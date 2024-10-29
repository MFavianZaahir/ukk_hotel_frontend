"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner"
import { Printer, Download, ChevronDown, ChevronUp, Calendar } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import Cookies from "js-cookie"
import Image from "next/image"
import logo from "@/public/w-hotels-1.png"
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { DatePicker } from "@/components/ui/date-picker"
import { format } from "date-fns"

type Transaction = {
  id_pemesanan: number
  nomor_pemesanan: string
  nama_tamu: string
  tgl_pemesanan: string
  tgl_check_in: string
  tgl_check_out: string
  jumlah_kamar: number
  status_pemesanan: string
  tipe_kamar: {
    nama_tipe_kamar: string
  }
}

type DetailPemesanan = {
  id_detail_pemesanan: number
  id_pemesanan: number
  id_kamar: number
  tgl_akses: string
  harga: number
  kamar: {
    nomor_kamar: string
  }
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [expandedTransaction, setExpandedTransaction] = useState<number | null>(null)
  const [detailPemesanan, setDetailPemesanan] = useState<{ [key: number]: DetailPemesanan[] }>({})
  const [totalPrices, setTotalPrices] = useState<{ [key: number]: number }>({})
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  useEffect(() => {
    fetchTransactions()
  }, [startDate, endDate])

  const fetchTransactions = async () => {
    try {
      let url = `${process.env.NEXT_PUBLIC_baseURL}/booking`
      const params = new URLSearchParams()

      if (startDate) {
        params.append('start_date', format(startDate, 'yyyy-MM-dd'))
      }
      if (endDate) {
        params.append('end_date', format(endDate, 'yyyy-MM-dd'))
      }

      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` }
      });
  
      if (response.data.success && response.data.data) {
        setTransactions(response.data.data);
      } else {
        toast.error("Failed to fetch transactions");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Unauthorized: Please log in again.");
      } else {
        toast.error("Error fetching transactions");
      }
    }
  };

  const fetchDetailPemesanan = async (id_pemesanan: number) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/booking/detail/${id_pemesanan}`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` }
        }
      );
  
      if (response.data.data) {
        setDetailPemesanan(prev => ({ ...prev, [id_pemesanan]: response.data.data }));
        setTotalPrices(prev => ({ ...prev, [id_pemesanan]: response.data.totalPrice }));
      } else {
        toast.error("Failed to fetch booking details");
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast.error("You are not authorized to view this transaction.");
      } else {
        toast.error("Error fetching booking details");
      }
    }
  };

  const handleExpand = (id_pemesanan: number) => {
    if (expandedTransaction === id_pemesanan) {
      setExpandedTransaction(null)
    } else {
      setExpandedTransaction(id_pemesanan)
      if (!detailPemesanan[id_pemesanan]) {
        fetchDetailPemesanan(id_pemesanan)
      }
    }
  }

  const handlePrint = (transaction: Transaction) => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Booking Receipt - ${transaction.nomor_pemesanan}</title>
            <style>
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                color: #333;
                line-height: 1.6;
              }
              .receipt {
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ddd;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
              }
              .header {
                text-align: center;
                margin-bottom: 20px;
              }
              .logo {
                max-width: 200px;
                margin-bottom: 10px;
              }
              h1 {
                color: #2c3e50;
              }
              .details {
                margin-top: 20px;
              }
              .details p {
                margin: 10px 0;
              }
              .room-details {
                margin-top: 20px;
                border-top: 1px solid #eee;
                padding-top: 20px;
              }
              .total {
                font-weight: bold;
                font-size: 1.2em;
                margin-top: 20px;
              }
              .footer {
                margin-top: 30px;
                text-align: center;
                font-size: 0.9em;
                color: #7f8c8d;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #f2f2f2;
              }
            </style>
          </head>
          <body>
            <div class="receipt">
              <div class="header">
                <img src="${logo.src}" alt="Wikusama Hotel Logo" class="logo">
                <h1>Booking Receipt</h1>
              </div>
              <div class="details">
                <p><strong>Booking Number:</strong> ${transaction.nomor_pemesanan}</p>
                <p><strong>Guest Name:</strong> ${transaction.nama_tamu}</p>
                <p><strong>Booking Date:</strong> ${new Date(transaction.tgl_pemesanan).toLocaleDateString()}</p>
                <p><strong>Check-in Date:</strong> ${new Date(transaction.tgl_check_in).toLocaleDateString()}</p>
                <p><strong>Check-out Date:</strong> ${new Date(transaction.tgl_check_out).toLocaleDateString()}</p>
                <p><strong>Room Type:</strong> ${transaction.tipe_kamar.nama_tipe_kamar}</p>
                <p><strong>Number of Rooms:</strong> ${transaction.jumlah_kamar}</p>
                <p><strong>Status:</strong> ${transaction.status_pemesanan}</p>
              </div>
              ${detailPemesanan[transaction.id_pemesanan] ? `
                <div class="room-details">
                  <h2>Room Details</h2>
                  <table>
                    <thead>
                      <tr>
                        <th>Room Number</th>
                        <th>Date</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${detailPemesanan[transaction.id_pemesanan].map(detail => `
                        <tr>
                          <td>${detail.kamar.nomor_kamar}</td>
                          <td>${new Date(detail.tgl_akses).toLocaleDateString()}</td>
                          <td>Rp. ${detail.harga.toLocaleString()}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colspan="2"><strong>Total Price</strong></td>
                        <td><strong>Rp. ${totalPrices[transaction.id_pemesanan].toLocaleString()}</strong></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ` : ''}
              <div class="footer">
                <p>Thank you for choosing Wikusama Hotel. We hope you enjoy your stay!</p>
              </div>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handleSave = (transaction: Transaction) => {
    const doc = new jsPDF()

    // Add logo
    doc.addImage(logo.src, 'PNG', 15, 15, 30, 30)

    // Add title
    doc.setFontSize(24)
    doc.setTextColor(44, 62, 80)
    doc.text('Booking Receipt', 105, 35, { align: 'center' })

    // Add booking details
    doc.setFontSize(12)
    doc.setTextColor(52, 73, 94)
    doc.setDrawColor(52, 73, 94)
    doc.line(15, 45, 195, 45)

    const detailsStartY = 55
    const detailsLineHeight = 7
    doc.text(`Booking Number: ${transaction.nomor_pemesanan}`, 15, detailsStartY)
    doc.text(`Guest Name: ${transaction.nama_tamu}`, 15, detailsStartY + detailsLineHeight)
    doc.text(`Booking Date: ${new Date(transaction.tgl_pemesanan).toLocaleDateString()}`, 15, detailsStartY + 2 * detailsLineHeight)
    doc.text(`Check-in Date: ${new Date(transaction.tgl_check_in).toLocaleDateString()}`, 15, detailsStartY + 3 * detailsLineHeight)
    doc.text(`Check-out Date: ${new Date(transaction.tgl_check_out).toLocaleDateString()}`, 15, detailsStartY + 4 * detailsLineHeight)
    doc.text(`Room Type: ${transaction.tipe_kamar.nama_tipe_kamar}`, 15, detailsStartY + 5 * detailsLineHeight)
    doc.text(`Number of Rooms: ${transaction.jumlah_kamar}`, 15, detailsStartY + 6 * detailsLineHeight)
    doc.text(`Status: ${transaction.status_pemesanan}`, 15, detailsStartY + 7 * detailsLineHeight)

    // Add room details table
    if (detailPemesanan[transaction.id_pemesanan]) {
      doc.autoTable({
        startY: detailsStartY + 9 * detailsLineHeight,
        head: [['Room Number', 'Date', 'Price']],
        body: detailPemesanan[transaction.id_pemesanan].map(detail => [
          detail.kamar.nomor_kamar,
          new Date(detail.tgl_akses).toLocaleDateString(),
          `Rp. ${detail.harga.toLocaleString()}`
        ]),
        foot: [['Total', '', `Rp. ${totalPrices[transaction.id_pemesanan].toLocaleString()}`]],
        headStyles: { fillColor: [52, 73, 94], textColor: [255, 255, 255] },
        footStyles: { fillColor: [236, 240, 241], textColor: [52, 73, 94], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: 10 },
      })
    }

    // Add footer
    const pageCount = doc.internal.getNumberOfPages()
    doc.setFontSize(10)
    doc.setTextColor(127, 140, 141)
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.text('Thank you for choosing Wikusama Hotel. We hope you enjoy your stay!', 105, doc.internal.pageSize.height - 10, { align: 'center' })
    }

    // Save the PDF
    doc.save(`booking_${transaction.nomor_pemesanan}.pdf`)
  }

  return (
    <div className="container mx-auto p-4 bg-gray-900 min-h-screen">
      <motion.h1 
        className="text-4xl font-bold mb-8 text-center text-white"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Your Transactions
      </motion.h1>

      <div className="mb-6 flex flex-col sm:flex-row justify-center items-center gap-4">
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4 text-gray-400" />
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Start Date"
            className="bg-gray-800 text-white border-gray-700"
          />
        </div>
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4 text-gray-400" />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            placeholderText="End Date"
            className="bg-gray-800 text-white border-gray-700"
          />
        </div>
      </div>

      <div className="space-y-6">
        {transactions.map((transaction) => (
          <motion.div
            
            key={transaction.id_pemesanan}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl text-blue-400">Booking #{transaction.nomor_pemesanan}</CardTitle>
                <CardDescription className="text-gray-300">
                  Status: {transaction.status_pemesanan}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-white">
                <p><strong>Guest:</strong> {transaction.nama_tamu}</p>
                <p><strong>Booking Date:</strong> {new Date(transaction.tgl_pemesanan).toLocaleDateString()}</p>
                <p><strong>Check-in:</strong> {new Date(transaction.tgl_check_in).toLocaleDateString()}</p>
                <p><strong>Check-out:</strong> {new Date(transaction.tgl_check_out).toLocaleDateString()}</p>
                <p><strong>Room Type:</strong> {transaction.tipe_kamar.nama_tipe_kamar}</p>
                <p><strong>Rooms:</strong> {transaction.jumlah_kamar}</p>
                
                <div className="mt-4">
                  <Button onClick={() => handleExpand(transaction.id_pemesanan)} className="bg-gray-700 hover:bg-gray-600 text-white">
                    {expandedTransaction === transaction.id_pemesanan ? (
                      <>
                        <ChevronUp className="mr-2 h-4 w-4" /> Hide Details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="mr-2 h-4 w-4" /> Show Details
                      </>
                    )}
                  </Button>
                </div>

                <AnimatePresence>
                  {expandedTransaction === transaction.id_pemesanan && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 space-y-2 text-white"
                    >
                      {detailPemesanan[transaction.id_pemesanan] ? (
                        <>
                          <h3 className="text-lg font-semibold">Room Details:</h3>
                          {detailPemesanan[transaction.id_pemesanan].map((detail) => (
                            <p key={detail.id_detail_pemesanan}>
                              Room {detail.kamar.nomor_kamar} - {new Date(detail.tgl_akses).toLocaleDateString()} - Rp. {detail.harga.toLocaleString()}
                            </p>
                          ))}
                          <p className="font-bold text-[#60a5fa]">
                            Total Price: Rp. {totalPrices[transaction.id_pemesanan]?.toLocaleString() || 'Calculating...'}
                          </p>
                        </>
                      ) : (
                        <p>Loading details...</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex justify-between mt-4">
                  <Button onClick={() => handlePrint(transaction)} className="bg-green-600 hover:bg-green-700 text-white">
                    <Printer className="mr-2 h-4 w-4" /> Print
                  </Button>
                  <Button onClick={() => handleSave(transaction)} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Download className="mr-2 h-4  w-4" /> Save PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}