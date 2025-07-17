// @ts-nocheck
import Link from 'next/link';
import Image from 'next/image';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { highlight } from 'sugar-high';
import React from 'react';
import CopyButton from './CopyButton';
import { Copy } from 'lucide-react';
import BrowserMockup from './BrowserMockup';

function Table({ data }) {
  let headers = data.headers.map((header, index) => (
    <th key={index}>{header}</th>
  ));
  let rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ));

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function CustomLink(props) {
  let href = props.href;

  if (href.startsWith('/')) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    );
  }

  if (href.startsWith('#')) {
    return <a {...props} />;
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />;
}

function RoundedImage(props) {
  return <Image alt={props.alt} className="rounded-lg" {...props} />;
}

function CodeBlock({ children, ...props }) {
  if (typeof children === 'string') {
    children = children.replace(/\n$/, '');
  }

  let codeHTML = highlight(children);

  return (
    <div className="bg-blue-50 dark:bg-gray-900 dark:text-white mb-4 py-2 pb-3 rounded block relative overflow-hidden">
      <div className="overflow-x-scroll px-4">
        <pre
          dangerouslySetInnerHTML={{ __html: codeHTML }}
          {...props}
          className="pr-10"
        />
      </div>

      <div className="pointer-events-none absolute right-0 top-0 h-full w-4 bg-gradient-to-l from-blue-50 dark:from-gray-900 to-transparent"></div>

      <div className="pointer-events-none absolute left-0 top-0 h-full w-4 bg-gradient-to-l from-transparent to-blue-50 dark:to-gray-900"></div>

      <div className="absolute top-0 right-0 bottom-0">
        <CopyButton textToCopy={children}>
          <div className="text-gray-400 p-2 px-4 hover:text-gray-600 hover:dark:text-gray-100 h-[2.6em] flex items-center hover:backdrop-blur-sm rounded-bl">
            <Copy size={16} />
          </div>
        </CopyButton>
      </div>
    </div>
  );
}

function inlineCode({ children, ...props }) {
  return (
    <CopyButton textToCopy={children}>
      <code
        className="bg-blue-50 dark:bg-gray-900 rounded p-1 pt-0.5 text-sm font-mono"
        {...props}
      >
        {children}
      </code>
    </CopyButton>
  );
}

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters except for -
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
}

function createHeading(level) {
  const Heading = ({ children }) => {
    let slug = slugify(children);
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement('a', {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: 'anchor',
        }),
      ],
      children
    );
  };

  Heading.displayName = `Heading${level}`;

  return Heading;
}

let components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  a: CustomLink,
  code: inlineCode,
  pre: (props) => {
    if (props.children && props.children.props) {
      return <CodeBlock {...props}>{props.children.props.children}</CodeBlock>;
    }
    return <pre {...props} />;
  },
  Table,
  BrowserMockup,
};

export function CustomMDX(props) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
    />
  );
}
