// /components/Navbar.tsx

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink
} from '@/components/ui/navigation-menu';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ChevronRight, Menu } from 'lucide-react';
import { ModeToggle } from '@/components/ModeToggle';
import { cn } from '@/lib/utils';
import logoUrl from '@/assets/logo.svg';

export function Navbar() {
  return (
    <header className="w-full border-b bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <img src={logoUrl} alt="Refund Status Logo" className="h-8 w-8" />
              <div className="text-lg font-semibold">Refund Status</div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <NavigationMenu>
                <NavigationMenuList className="flex gap-4">
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="#"
                      className={cn('text-primary-foreground hover:underline', 'transition-colors')}
                    >
                      Home
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="#"
                      className={cn('text-primary-foreground hover:underline', 'transition-colors')}
                    >
                      My Refund
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="#"
                      className={cn('text-primary-foreground hover:underline', 'transition-colors')}
                    >
                      Help
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          <div className="hidden md:block">
            <ModeToggle />
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden ml-auto">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-6">
                  <span>Navigation</span>
                  <ModeToggle />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2">
                <a
                  href="/status"
                  className="flex justify-between items-center w-full px-4 py-4 text-primary font-medium active:bg-primary active:text-primary-foreground transition-colors"
                >
                  Refund Status
                  <ChevronRight className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="flex justify-between items-center w-full px-4 py-4 text-primary font-medium active:bg-primary active:text-primary-foreground transition-colors"
                >
                  My Refund
                  <ChevronRight className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="flex justify-between items-center w-full px-4 py-4 text-primary font-medium active:bg-primary active:text-primary-foreground transition-colors"
                >
                  Help
                  <ChevronRight className="h-4 w-4" />
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
