import { SortableHeader } from "../table-headers/SortableHeader";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const columns = [
  { key: "title", label: "Song Title", width: "w-56" },
  { key: "artist", label: "Artist", width: "w-40" },
  { key: "album", label: "Album", width: "w-40" },
  { key: "year", label: "Year", width: "w-24" },
];

export function SongsTable({
  songs,
  sortKey,
  sortDirection,
  onSort,
}: {
  songs: any[];
  sortKey: string;
  sortDirection: "asc" | "desc";
  onSort: (key: string) => void;
}) {
  return (
    <div className="overflow-x-auto px-4 sm:px-8 md:px-16 lg:px-32 py-8">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={`${col.width} px-0 py-0 text-center align-middle`}
              >
                <SortableHeader
                  label={col.label}
                  active={sortKey === col.key}
                  direction={sortKey === col.key ? sortDirection : null}
                  onClick={() => onSort(col.key)}
                />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {songs.map((song, idx) => (
            <TableRow key={song.id || idx}>
              <TableCell className="w-56 text-center py-3">{song.title}</TableCell>
              <TableCell className="w-40 text-center py-3">{song.artist}</TableCell>
              <TableCell className="w-40 text-center py-3">{song.album}</TableCell>
              <TableCell className="w-24 text-center py-3">{song.year}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 