export default function CompletionPage() {
  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="rounded-lg bg-white p-8 shadow dark:bg-gray-800">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            お問い合わせを受け付けました
          </h1>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            休会・退会申請を受け付けました。
            <br />
            内容を確認の上、担当者より連絡させていただく場合がございます。
          </p>
          <a
            href="/student"
            className="inline-block rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            ホームへ戻る
          </a>
        </div>
      </div>
    </div>
  )
}
