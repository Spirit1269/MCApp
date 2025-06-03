"use client";

import Link from "next/link";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { Bike, User, Calendar, DollarSign, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogin = () => {
    instance.loginRedirect();
  };

  const handleLogout = () => {
    instance.logoutRedirect();
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-200",
      isScrolled ? "bg-background/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
    )}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="hidden items-center space-x-2 md:flex">
            <Bike className="h-6 w-6 text-chart-1" />
            <span className="font-bold">Motorcycle Club Hub</span>
          </Link>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <div className="px-7">
                <Link 
                  href="/" 
                  className="flex items-center gap-2 pb-6 pt-4"
                  onClick={() => setIsOpen(false)}
                >
                  <Bike className="h-6 w-6 text-chart-1" />
                  <span className="font-bold">Motorcycle Club Hub</span>
                </Link>
              </div>
              <div className="flex flex-col gap-3 px-7">
                <Link
                  href="/members"
                  className="flex items-center gap-2 py-2 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>Members</span>
                </Link>
                <Link
                  href="/events"
                  className="flex items-center gap-2 py-2 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  <Calendar className="h-5 w-5" />
                  <span>Events</span>
                </Link>
                <Link
                  href="/dues"
                  className="flex items-center gap-2 py-2 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  <DollarSign className="h-5 w-5" />
                  <span>Dues</span>
                </Link>
              </div>
              <div className="mt-6 px-7">
                {isAuthenticated ? (
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                  >
                    Sign Out
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    onClick={() => {
                      handleLogin();
                      setIsOpen(false);
                    }}
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Club</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          href="/about"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-chart-1/20 to-chart-1/30 p-6 no-underline outline-none focus:shadow-md"
                        >
                          <Bike className="h-6 w-6 text-chart-1" />
                          <div className="mb-2 mt-4 text-lg font-medium">
                            About Our Club
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Learn about our history, mission, and values.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link 
                          href="/districts" 
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Districts</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Find chapters in your area
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link 
                          href="/leadership" 
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Leadership</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Meet our national officers
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/members" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <User className="mr-2 h-4 w-4" />
                    Members
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/events" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Events
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/dues" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <DollarSign className="mr-2 h-4 w-4" />
                    Dues
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        <div className="flex items-center gap-4">
          <ModeToggle />
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="https://images.pexels.com/photos/1139743/pexels-photo-1139743.jpeg?auto=compress&cs=tinysrgb&w=1600" />
                        <AvatarFallback>MR</AvatarFallback>
                      </Avatar>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[200px] gap-3 p-4">
                        <li>
                          <NavigationMenuLink asChild>
                            <Link 
                              href="/profile" 
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">Profile</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                View and edit your profile
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link 
                              href="/dashboard" 
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">Dashboard</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                View your personal dashboard
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <button
                            onClick={handleLogout}
                            className="w-full block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-left"
                          >
                            <div className="text-sm font-medium leading-none">Sign Out</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Log out of your account
                            </p>
                          </button>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          ) : (
            <Button onClick={handleLogin} className="hidden md:inline-flex">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}