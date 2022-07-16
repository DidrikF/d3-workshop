/* eslint-disable @next/next/no-img-element */
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  styled,
  Toolbar,
} from "@mui/material";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";

const drawerWidth = 240;

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Head>
        <meta
          name="description"
          content="Workshop about building data visualizations with D3"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box sx={{ display: "flex" }}>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar>
            <NextLink href="/">
              <StyledImg
                src="/assets/default_200_percent/200-error-offline.png"
                width={48}
                height={48}
                alt="Logo"
              />
            </NextLink>
          </Toolbar>

          <Divider />

          <List>
            <Link href="/workshop" label="Material" />

            <List component="div" disablePadding>
              <Link
                href="/workshop/1-intro"
                label="Introduction"
                sx={{ pl: 4 }}
              />
            </List>

            <Link href="/problems" label="Problems" reload />
          </List>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {children}
        </Box>
      </Box>
    </>
  );
}

const StyledImg = styled("img")({
  ":hover": {
    cursor: "pointer",
  },
});

const Link = styled(
  ({
    href,
    label,
    className,
    reload,
  }: {
    href: string;
    label: string;
    className?: string;
    reload?: boolean;
  }) => {
    const { asPath } = useRouter();

    const LinkComponent = !reload ? NextLink : a;

    return (
      <ListItem disablePadding>
        <LinkComponent href={href}>
          <ListItemButton
            className={className}
            sx={{ background: asPath === href ? "primary.light" : undefined }}
          >
            <ListItemText primary={label} />
          </ListItemButton>
        </LinkComponent>
      </ListItem>
    );
  }
)({});

const a = styled("a")({ width: "100%" });
