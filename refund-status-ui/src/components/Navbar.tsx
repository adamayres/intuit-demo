// /components/Navbar.tsx

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink
} from '@/components/ui/navigation-menu';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
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
            <SheetContent side="left" className="p-6">
              <nav className="flex flex-col gap-4">
                <a href="#" className="text-primary-foreground hover:underline">
                  Home
                </a>
                <a href="#" className="text-primary-foreground hover:underline">
                  My Refund
                </a>
                <a href="#" className="text-primary-foreground hover:underline">
                  Help
                </a>
              </nav>
              <div className="mt-6">
                <ModeToggle />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
