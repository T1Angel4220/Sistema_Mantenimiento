import React from 'react';

export const Table = ({ children }) => (
  <table className="min-w-full bg-white border-collapse">{children}</table>
);

export const TableHeader = ({ children }) => (
  <thead className="bg-gray-200">{children}</thead>
);

export const TableBody = ({ children }) => <tbody>{children}</tbody>;

export const TableRow = ({ children }) => (
  <tr className="hover:bg-gray-100">{children}</tr>
);

export const TableCell = ({ children }) => (
  <td className="border px-4 py-2 text-sm">{children}</td>
);

export const TableHead = ({ children }) => (
  <th className="border px-4 py-2 text-sm font-bold text-left">{children}</th>
);
