import { format } from 'date-fns'

/**
 * 日付をyyyy-mm-dd形式にフォーマットする関数
 * @param date - フォーマットしたい日付（ISO形式の文字列またはDateオブジェクト）
 * @returns フォーマットされた日付文字列
 */
export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return ''
  return format(new Date(date), 'yyyy-MM-dd')
}
