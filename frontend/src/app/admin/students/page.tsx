export default async function StudentsPage() {
  return (
    <div className="mx-auto max-w-4xl py-8">
      <div className="mb-6 items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          受講生一覧
        </h1>
        <div className="flex h-screen overflow-hidden bg-gray-100 text-sm text-gray-600 dark:bg-gray-900 dark:text-white">
          <div className="flex h-full grow flex-col overflow-hidden">
            <div className="flex grow overflow-x-hidden">
              <div className="grow overflow-y-auto bg-white dark:bg-gray-900">
                <div className="sticky top-0 flex w-full flex-col border-b border-gray-200 bg-white px-4 pt-4 sm:px-7 sm:pt-7 dark:border-gray-800 dark:bg-gray-900 dark:text-white">
                  <div className="mt-4 flex items-center space-x-3 sm:mt-7">
                    <a
                      href="#"
                      className="border-b-2 border-blue-500 px-3 pb-1.5 text-blue-500 dark:border-white dark:text-white"
                    >
                      受講中
                    </a>
                    <a
                      href="#"
                      className="border-b-2 border-transparent px-3 pb-1.5 text-gray-600 dark:text-gray-400"
                    >
                      休会中
                    </a>
                    <a
                      href="#"
                      className="hidden border-b-2 border-transparent px-3 pb-1.5 text-gray-600 sm:block dark:text-gray-400"
                    >
                      退会済
                    </a>
                  </div>
                </div>
                <div className="p-4 sm:p-7">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-gray-400">
                        <th className="border-b border-gray-200 px-3 pb-3 pt-0 font-normal dark:border-gray-800">
                          氏名
                        </th>
                        <th className="border-b border-gray-200 px-3 pb-3 pt-0 font-normal dark:border-gray-800">
                          期
                        </th>
                        <th className="hidden border-b border-gray-200 px-3 pb-3 pt-0 font-normal md:table-cell dark:border-gray-800">
                          チーム
                        </th>
                        <th className="border-b border-gray-200 px-3 pb-3 pt-0 font-normal dark:border-gray-800">
                          ペア
                        </th>
                        <th className="border-b border-gray-200 px-3 pb-3 pt-0 font-normal text-white sm:text-gray-400 dark:border-gray-800">
                          入会日
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 dark:text-gray-100">
                      <tr>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          <div className="flex items-center">Tanaka Taro</div>
                        </td>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          <div className="flex items-center">1</div>
                        </td>
                        <td className="hidden border-b border-gray-200 px-1 py-2 sm:p-3 md:table-cell dark:border-gray-800">
                          1
                        </td>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          a
                        </td>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          <div className="flex items-center">2024/9/12</div>
                        </td>
                      </tr>
                      <tr>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          <div className="flex items-center">Tanaka Jiro</div>
                        </td>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          <div className="flex items-center">1</div>
                        </td>
                        <td className="hidden border-b border-gray-200 px-1 py-2 sm:p-3 md:table-cell dark:border-gray-800">
                          1
                        </td>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          a
                        </td>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          <div className="flex items-center">2024/9/12</div>
                        </td>
                      </tr>
                      <tr>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          <div className="flex items-center">Tanaka Saburo</div>
                        </td>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          <div className="flex items-center">1</div>
                        </td>
                        <td className="hidden border-b border-gray-200 px-1 py-2 sm:p-3 md:table-cell dark:border-gray-800">
                          1
                        </td>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          b
                        </td>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          <div className="flex items-center">2024/9/12</div>
                        </td>
                      </tr>
                      <tr>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          <div className="flex items-center">Tanaka Shiro</div>
                        </td>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          <div className="flex items-center">1</div>
                        </td>
                        <td className="hidden border-b border-gray-200 px-1 py-2 sm:p-3 md:table-cell dark:border-gray-800">
                          1
                        </td>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          b
                        </td>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          <div className="flex items-center">2024/9/12</div>
                        </td>
                      </tr>
                      <tr>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          <div className="flex items-center">Tanaka Goro</div>
                        </td>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          <div className="flex items-center">1</div>
                        </td>
                        <td className="hidden border-b border-gray-200 px-1 py-2 sm:p-3 md:table-cell dark:border-gray-800">
                          1
                        </td>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          c
                        </td>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          <div className="flex items-center">2024/9/12</div>
                        </td>
                      </tr>
                      <tr>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          <div className="flex items-center">Tanaka Rokuro</div>
                        </td>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          <div className="flex items-center">1</div>
                        </td>
                        <td className="hidden border-b border-gray-200 px-1 py-2 sm:p-3 md:table-cell dark:border-gray-800">
                          1
                        </td>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          c
                        </td>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          <div className="flex items-center">2024/9/12</div>
                        </td>
                      </tr>
                      <tr>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          <div className="flex items-center">
                            Tanaka Shichiro
                          </div>
                        </td>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          <div className="flex items-center">2</div>
                        </td>
                        <td className="hidden border-b border-gray-200 px-1 py-2 sm:p-3 md:table-cell dark:border-gray-800">
                          1
                        </td>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          a
                        </td>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          <div className="flex items-center">2024/9/12</div>
                        </td>
                      </tr>
                      <tr>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          <div className="flex items-center">
                            Tanaka Hachiro
                          </div>
                        </td>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          <div className="flex items-center">2</div>
                        </td>
                        <td className="hidden border-b border-gray-200 px-1 py-2 sm:p-3 md:table-cell dark:border-gray-800">
                          1
                        </td>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          a
                        </td>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          <div className="flex items-center">2024/9/12</div>
                        </td>
                      </tr>
                      <tr>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          <div className="flex items-center">Tanaka Kyuro</div>
                        </td>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          <div className="flex items-center">2</div>
                        </td>
                        <td className="hidden border-b border-gray-200 px-1 py-2 sm:p-3 md:table-cell dark:border-gray-800">
                          1
                        </td>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          b
                        </td>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          <div className="flex items-center">2024/9/12</div>
                        </td>
                      </tr>
                      <tr>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          <div className="flex items-center">Tanaka Juro</div>
                        </td>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          <div className="flex items-center">2</div>
                        </td>
                        <td className="hidden border-b border-gray-200 px-1 py-2 sm:p-3 md:table-cell dark:border-gray-800">
                          1
                        </td>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          b
                        </td>
                        <td className="border-b border-gray-200 px-1 py-2 sm:p-3 dark:border-gray-800">
                          <div className="flex items-center">2024/9/12</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="mt-5 flex w-full justify-end space-x-2">
                    <button className="inline-flex size-8 items-center justify-center rounded-md border border-gray-200 leading-none text-gray-400 shadow dark:border-gray-800">
                      <svg
                        className="w-4"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="15 18 9 12 15 6"></polyline>
                      </svg>
                    </button>
                    <button className="inline-flex size-8 items-center justify-center rounded-md border border-gray-200 bg-gray-100 leading-none text-gray-500 shadow dark:border-gray-800 dark:bg-gray-800 dark:text-white">
                      1
                    </button>
                    <button className="inline-flex size-8 items-center justify-center rounded-md border border-gray-200 leading-none text-gray-500 shadow dark:border-gray-800">
                      2
                    </button>
                    <button className="inline-flex size-8 items-center justify-center rounded-md border border-gray-200 leading-none text-gray-500 shadow dark:border-gray-800">
                      3
                    </button>
                    <button className="inline-flex size-8 items-center justify-center rounded-md border border-gray-200 leading-none text-gray-500 shadow dark:border-gray-800">
                      4
                    </button>
                    <button className="inline-flex size-8 items-center justify-center rounded-md border border-gray-200 leading-none text-gray-400 shadow dark:border-gray-800">
                      <svg
                        className="w-4"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
