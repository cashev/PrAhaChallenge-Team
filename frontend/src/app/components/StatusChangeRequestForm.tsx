'use client'

import { useRouter } from 'next/navigation'
import type React from 'react'
import { useEffect, useState } from 'react'

type StatusChangeType = '休会' | '退会'

interface StatusChangeRequestFormProps {
  onSubmit: (
    type: StatusChangeType,
    reason: string,
    requestDate: Date,
  ) => Promise<void>
}

const getAvailableDates = (type: StatusChangeType) => {
  const today = new Date()
  const dates: Date[] = []

  // 退会の場合は今月も含める
  const startMonth = type === '退会' ? 0 : 1

  // 今月/来月から12ヶ月分の日付を生成
  for (let i = startMonth; i < startMonth + 12; i++) {
    const targetMonth = new Date(today.getFullYear(), today.getMonth() + i)
    if (type === '休会') {
      // 月初日
      dates.push(new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1))
    } else {
      // 月末日
      dates.push(
        new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0),
      )
    }
  }
  return dates
}

const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const StatusChangeRequestForm: React.FC<StatusChangeRequestFormProps> = ({
  onSubmit,
}) => {
  const router = useRouter()
  const [type, setType] = useState<StatusChangeType>('休会')
  const [reason, setReason] = useState('')
  const [requestDate, setRequestDate] = useState<Date>(new Date())
  const [suspensionPeriod, setSuspensionPeriod] = useState<number | undefined>(
    undefined,
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [availableDates, setAvailableDates] = useState<Date[]>([])

  useEffect(() => {
    const dates = getAvailableDates(type)
    setAvailableDates(dates)
    setRequestDate(dates[0])
    if (type === '休会') {
      setSuspensionPeriod(1)
    } else {
      setSuspensionPeriod(undefined)
    }
  }, [type])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      await onSubmit(type, reason, requestDate)
      router.push('/student/contact/completion')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('申請の送信に失敗しました。')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/30">
          <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          申請種別
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as StatusChangeType)}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="休会">休会</option>
          <option value="退会">退会</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {type === '休会' ? '休会開始日（月初日）' : '退会日（月末日）'}
        </label>
        <select
          value={formatDate(requestDate)}
          onChange={(e) => setRequestDate(new Date(e.target.value))}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          {availableDates.map((date) => (
            <option key={date.toISOString()} value={formatDate(date)}>
              {`${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`}
            </option>
          ))}
        </select>
      </div>

      {type === '休会' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            休会期間
          </label>
          <select
            value={suspensionPeriod || 1}
            onChange={(e) => setSuspensionPeriod(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="1">1ヶ月</option>
            <option value="2">2ヶ月</option>
            <option value="3">3ヶ月</option>
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          理由（任意）
        </label>
        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
          今後の運営のために理由をお聞かせください。
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:bg-gray-400 dark:bg-indigo-500 dark:hover:bg-indigo-400"
      >
        {isSubmitting ? '送信中...' : '申請を送信'}
      </button>
    </form>
  )
}

export default StatusChangeRequestForm
