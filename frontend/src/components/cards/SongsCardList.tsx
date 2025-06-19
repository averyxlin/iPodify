import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { useDashboard } from "../../contexts/DashboardContext";
import { Pagination } from "../ui/Pagination";

export function SongsCardList({
  songs,
  sortValue,
  onSortChange,
  sortOptions,
  currentPage,
  onPageChange,
  itemsPerPage = 10,
}: {
  songs: any[];
  sortValue: string;
  onSortChange: (key: string) => void;
  sortOptions: { label: string; value: string }[];
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
}) {
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
    <div className="pt-4 pb-6">
      <div className="sticky top-[64px] z-10 bg-background pb-2">
        <Select value={sortValue} onValueChange={onSortChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-4 mt-2">
        {paginatedSongs.map((song, idx) => (
          <Card key={song.id || idx}>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Label className="text-xs font-medium text-muted-foreground">Song Title</Label>
                    <CardTitle className="text-base font-semibold">{song.title}</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleDashboard(song)}
                    className="ml-2 h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                    aria-label={isInDashboard(song.id) ? 'Remove from dashboard' : 'Add to dashboard'}
                  >
                    {isInDashboard(song.id) ? (
                      <Minus size={16} />
                    ) : (
                      <Plus size={16} />
                    )}
                  </Button>
                </div>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Artist</Label>
                  <p className="text-base">{song.artist}</p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Album</Label>
                  <p className="text-base">{song.album}</p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Year</Label>
                  <p className="text-base">{song.year}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
} 