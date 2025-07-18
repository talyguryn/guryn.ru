'use client';

import React, { useState } from 'react';
import { Folder, FolderOpen, File } from 'lucide-react';

type FilesStructureItem = {
  name: string;
  opacity?: number;
  collapsed?: boolean;
  subitems?: FilesStructureItem[];
};

function TreeItem({ item }: { item: FilesStructureItem }) {
  const isFolder = item.subitems && item.subitems.length > 0;
  const opacityStyle = item.opacity ? `opacity-${item.opacity}` : '';
  const [open, setOpen] = useState<boolean>(item.collapsed ? false : true);

  console.log('opacityStyle', opacityStyle);

  return (
    <li className={`${opacityStyle}`}>
      <div
        className={`flex items-center gap-2 select-none ${
          isFolder ? 'cursor-pointer' : ''
        }`}
        onClick={() => isFolder && setOpen(!open)}
      >
        {isFolder ? (
          open ? (
            <FolderOpen className="w-4 h-4 text-yellow-600" />
          ) : (
            <Folder className="w-4 h-4 text-yellow-600" />
          )
        ) : (
          <File className="w-4 h-4 text-gray-600 dark:text-gray-500" />
        )}
        <span>{item.name}</span>
      </div>
      {isFolder && open && (
        <ul className="ml-5">
          {item.subitems!.map((child, idx) => (
            <TreeItem key={idx} item={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function FilesStructure({
  structure,
}: {
  structure: FilesStructureItem;
}) {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 py-4 px-8 mb-4 rounded-md">
      <ul className="rounded-md text-sm leading-6 font-mono pl-0!">
        <TreeItem item={structure} />
      </ul>
    </div>
  );
}
