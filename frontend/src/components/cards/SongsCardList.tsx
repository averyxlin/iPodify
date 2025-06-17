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

export function SongsCardList({
  songs,
  sortValue,
  onSortChange,
  sortOptions,
}: {
  songs: any[];
  sortValue: string;
  onSortChange: (key: string) => void;
  sortOptions: { label: string; value: string }[];
}) {
  return (
    <div className="pt-4 pb-6">
      <div className="sticky top-[64px] z-10 bg-white pb-2">
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
        {songs.map((song, idx) => (
          <Card key={song.id || idx}>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Song Title</Label>
                  <CardTitle className="text-base font-semibold">{song.title}</CardTitle>
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
    </div>
  );
} 