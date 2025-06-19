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
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { useDashboard } from "../../contexts/DashboardContext";
import { Pagination } from "../ui/Pagination";

const columns = [
  { key: "title", label: "Song Title", width: "w-56" },
  { key: "artist", label: "Artist", width: "w-40" },
  { key: "album", label: "Album", width: "w-40" },
  { key: "year", label: "Year", width: "w-24" },
];

interface SongsTableProps {
  songs: any[];
  sortKey: string;
  sortDirection: "asc" | "desc";
  onSort: (key: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
}

export function SongsTable({
  songs,
  sortKey,
  sortDirection,
  onSort,
  currentPage,
  onPageChange,
  itemsPerPage = 10,
}: SongsTableProps) {
  const { addToDashboard, removeFromDashboard, isInDashboard } = useDashboard();

  const totalPages = Math.ceil(songs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSongs = songs.slice(startIndex, endIndex);

  const handleToggleDashboard = (song: any) => {
    if (isInDashboard(song.id)) {
      removeFromDashboard(song.id);
    } else {
      addToDashboard(song);
    }
  };

  return (
    <Card className="mx-4 sm:mx-8 md:mx-16 lg:mx-32 my-8">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
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
                <TableHead className="w-12 px-0 py-0 text-center align-middle">
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSongs.map((song, idx) => (
                <TableRow key={song.id || idx}>
                  <TableCell className="w-56 text-center py-3">{song.title}</TableCell>
                  <TableCell className="w-40 text-center py-3">{song.artist}</TableCell>
                  <TableCell className="w-40 text-center py-3">{song.album}</TableCell>
                  <TableCell className="w-24 text-center py-3">{song.year}</TableCell>
                  <TableCell className="w-12 text-center py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleDashboard(song)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                      aria-label={isInDashboard(song.id) ? 'Remove from dashboard' : 'Add to dashboard'}
                    >
                      {isInDashboard(song.id) ? (
                        <Minus size={16} />
                      ) : (
                        <Plus size={16} />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="p-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </CardContent>
    </Card>
  );
} 