"use client";

import Link from "next/link";

import { useTranslations } from "next-intl";
import { siGithub } from "simple-icons";

import { SimpleIcon } from "@/components/simple-icon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const githubLinks = [
  {
    label: "Meu Perfil",
    href: "https://github.com/devconnecting1",
  },
  {
    label: "Workspaacing",
    href: "https://github.com/devconnecting1/Workspaacing",
  },
  {
    label: "Repositórios",
    href: "https://github.com/devconnecting1?tab=repositories",
  },
] as const;

export function GitHubRepositoriesMenu() {
  const t = useTranslations("shell");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" aria-label={t("openRepositories")}>
          <SimpleIcon icon={siGithub} className="fill-primary-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>GitHub</DropdownMenuLabel>
          {githubLinks.map((link) => (
            <DropdownMenuItem key={link.href} asChild>
              <Link prefetch={false} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
