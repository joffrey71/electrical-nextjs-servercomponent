'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { type User } from '@supabase/supabase-js'

export function UserNav({ user }: { user: User | null }) {
  const supabase = createClient();
  const [firstname, setFirstname] = useState<string | null>(null)
  const [lastname, setLastname] = useState<string | null>(null)
  const router = useRouter();

  if (!user) {
    throw new Error("User not found")
    return
  }

  const getProfile = useCallback(async () => {
    try {
      const { data, error, status } =  await supabase
                                              .from("clients")
                                              .select("firstname, lastname")
                                              .eq("client_user_id", user.id)
                                              .single()
      if (error) {
        console.log(error)
        throw error
      }
      if (data) {
        setFirstname(data.firstname)
        setLastname(data.lastname)
      }
    } catch (error) {
      alert('Error loading user data!')
    } 
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile]);
  
  

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }
                                


  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
            <Avatar className='h-8 w-8'>
            <AvatarImage src={user?.user_metadata.avatar_url ?? ''} alt={firstname && lastname ? `${firstname} ${lastname}` : ""} />
                          <AvatarFallback>
                            {firstname ? `${firstname.charAt(0).toUpperCase()}${lastname ? lastname.charAt(0).toUpperCase() : ""}` : "C"}
                          </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className='w-56'
          align='end'
          sideOffset={10}
          forceMount
        >
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col space-y-1'>
              <p className='text-sm leading-none font-medium'>
                {firstname && lastname ? `${firstname} ${lastname}` : ""}
              </p>
              <p className='text-muted-foreground text-xs leading-none'>
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Billing
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>New Team</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}
