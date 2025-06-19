import { SongsTable } from "../table/SongsTable";
import { SongsCardList } from "./SongsCardList";
import { useMediaQuery } from "../../lib/useMediaQuery";

export function SongsListResponsive(props: any) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { sortKey, sortDirection, onSortChange, currentPage, onPageChange, itemsPerPage } = props;
  
  const handleSort = (key: string) => {
    if (key === sortKey) {
      onSortChange(`${key}:${sortDirection === 'asc' ? 'desc' : 'asc'}`);
    } else {
      onSortChange(`${key}:asc`);
    }
  };

  if (isMobile) {
    return (
      <SongsCardList 
        {...props} 
        currentPage={currentPage}
        onPageChange={onPageChange}
        itemsPerPage={itemsPerPage}
      />
    );
  }
  
  return (
    <SongsTable 
      {...props} 
      onSort={handleSort}
      currentPage={currentPage}
      onPageChange={onPageChange}
      itemsPerPage={itemsPerPage}
    />
  );
} 