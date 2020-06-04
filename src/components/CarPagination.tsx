import React, { forwardRef } from "react";
import Pagination from "@material-ui/lab/Pagination";
import PaginationItem from "@material-ui/lab/PaginationItem";
import { PaginationRenderItemParams } from "@material-ui/lab";
import Link from "next/link";
import { ParsedUrlQuery } from "querystring";
import { getAsString } from "../getAsString";

interface CarPaginationProps {
  query: ParsedUrlQuery;
  totalPages: number;
}

export const CarPagination = ({ query, totalPages }: CarPaginationProps) => {
  return (
    <Pagination
      page={parseInt(getAsString(query.page) || "1")}
      count={totalPages}
      renderItem={(item) => (
        <PaginationItem
          component={MaterialUiLink}
          query={query}
          item={item}
          {...item}
        />
      )}
    />
  );
};

export interface MaterialUiLinkProps {
  item: PaginationRenderItemParams;
  query: ParsedUrlQuery;
}

const MaterialUiLink = forwardRef<HTMLAnchorElement, MaterialUiLinkProps>(
  ({ item, query, ...props }) => (
    <Link
      href={{ pathname: "/cars", query: { ...query, page: item.page } }}
      shallow
    >
      <a {...props}></a>
    </Link>
  )
);
