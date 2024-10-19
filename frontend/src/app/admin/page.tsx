import React from 'react';
import Link from 'next/link';

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">
          管理者ダッシュボード
        </h1>
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
              管理メニュー
            </h2>
            <ul className="mt-2 divide-y divide-gray-200 dark:divide-gray-700">
              <li className="py-4">
                <Link href="/admin/tasks" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300">
                  課題一覧
                </Link>
              </li>
              {/* 他の管理メニュー項目をここに追加 */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
