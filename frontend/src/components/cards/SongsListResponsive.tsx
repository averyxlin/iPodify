import { SongsTable } from "../table/SongsTable";
import { SongsCardList } from "./SongsCardList";
import { useMediaQuery } from "../../lib/useMediaQuery";

export function SongsListResponsive(props: any) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  if (isMobile) {
    return <SongsCardList {...props} />;
  }
  const { sortKey, sortDirection, onSortChange } = props;
  const handleSort = (key: string) => {
    if (key === sortKey) {
      onSortChange(`${key}:${sortDirection === 'asc' ? 'desc' : 'asc'}`);
    } else {
      onSortChange(`${key}:asc`);
    }
  };
  return <SongsTable {...props} onSort={handleSort} />;
} 