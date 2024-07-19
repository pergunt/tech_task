import { useState, useEffect } from "react";
import {
  Box,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
} from "@mui/material";
import { routes, API } from "configs";
import { NavLink, Image, InfiniteScroll, PreLoader } from "components";
import qs from "query-string";
import { ProductsListHeader } from "./components";
import { useQueryParams } from "hooks";
import { ProductListItem } from "../types";

const LIMIT = 25;

const ProductsList = () => {
  const [state, setState] = useState<{
    loading: boolean;
    hasMore: boolean;
    items: ProductListItem[];
  }>({
    loading: false,
    hasMore: true,
    items: [],
  });
  const [params] = useQueryParams();

  const loadData = async (url: string) => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));

    try {
      const { data } = await API.get(`/products${url}`);

      setState({
        loading: false,
        hasMore: data.total !== data.products.length,
        items: data.products,
      });
    } catch {
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  };

  useEffect(() => {
    if (params.category) {
      loadData(`/category/${params.category}`);
    } else {
      const search = qs.stringify(params);
      const url = `${search ? `?${search}` : ""}`;

      const timer = setTimeout(() => {
        loadData(url);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [params]);

  return (
    <Box>
      <ProductsListHeader />
      <Box id="scrollableBox" height={500} style={{ overflowY: "auto" }}>
        <InfiniteScroll
          scrollableTarget="scrollableBox"
          style={{ overflowY: "hidden" }}
          dataLength={state.items.length + Number(state.hasMore)}
          hasMore={state.hasMore}
          loader={state.loading && <PreLoader />}
          next={() => {
            loadData(`?limit=${state.items.length + LIMIT}`);
          }}
        >
          {state.items.map((item) => {
            return (
              <ListItemButton
                data-testid="products-list-item"
                key={item.id}
                to={routes.productDetails(item.id)}
                component={NavLink}
              >
                <ListItemAvatar>
                  <Image alt="Product avatar" src={item.images[0]} />
                </ListItemAvatar>
                <ListItemText
                  primary={item.title}
                  secondary={`${item.price}$`}
                />
              </ListItemButton>
            );
          })}
        </InfiniteScroll>
      </Box>
    </Box>
  );
};

export default ProductsList;
