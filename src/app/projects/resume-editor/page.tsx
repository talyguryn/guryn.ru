'use client';

import EditableDiv from '@/app/components/editableDiv';
import './styles.css';

import Leaflet, { leafletDataLocalStorageKey } from '@/app/components/leaflet';
import { defaultLeafletData } from '@/data/leaflet';
import { LeafletData } from '@/types/leaflet';

import React from 'react';
export default function Page() {
  const [leafletData, setLeafletData] = React.useState<LeafletData | null>(
    null
  );
  const [leafletFilename, setLeafletFilename] = React.useState<string>('');

  return (
    <div className='min-h-screen pt-24 pb-24'>

      {/* fixed topbar with 'download pdf' button */}
      <div className='fixed top-0 left-0 right-0 bg-red-100 shadow p-4 flex justify-center z-10'>

        <div className='max-w-4xl flex items-center justify-between w-full'>
          <div>
            <EditableDiv
              value={leafletFilename}
              placeholder='Резюме.pdf'
              className='font-bold w-96 bg-white'
              onChange={(value) => setLeafletFilename(value)}
            />
          </div>
          <div className='flex gap-2'>
            <a
              className=' px-4 py-2 transition cursor-pointer'
              onClick={() => {
                const leafletElement = document.getElementById('leaflet');
                import('@/utils/export-to-pdf').then(({ exportToPdf }) => {
                  exportToPdf(leafletElement, false, 'leaflet.pdf');
                });
              }}
            >
              Показать превью
            </a>

            <button
              className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition cursor-pointer'
              onClick={() => {
                const leafletElement = document.getElementById('leaflet');
                import('@/utils/export-to-pdf').then(({ exportToPdf }) => {
                  exportToPdf(leafletElement, true, leafletFilename);
                });
              }}
            >
              Скачать PDF
            </button>
          </div>

        </div>
      </div>
      <div className='flex justify-center flex-col items-center'>
        <Leaflet passedLeafletData={leafletData} />

        <div className="flex justify-start items-start mt-6 mb-8">
          <button
            className="text-gray-500 cursor-pointer underline decoration-dashed decoration-[0.01em] underline-offset-[0.5em] [text-decoration-color:color-mix(in_srgb,_currentColor_40%,_transparent)] hover:[text-decoration-color:inherit] ml-10"
            onClick={() => {
              if (
                !confirm(
                  'Вы уверены, что хотите очистить документ? Все данные будут потеряны.'
                )
              ) {
                return;
              }

              setLeafletData(defaultLeafletData);
              localStorage.removeItem(leafletDataLocalStorageKey);
            }}
          >
            Очистить документ
          </button>
        </div>

      </div>
    </div >
  );
}