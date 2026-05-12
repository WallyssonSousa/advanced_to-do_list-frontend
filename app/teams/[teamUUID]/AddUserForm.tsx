"use client"

import { useEffect, useState } from "react"
import { UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { updateTeam } from "@/services/teamService"
import { getUsers } from "@/services/userService"
import { UserSearchResult } from "@/types/user"

interface AddUserFormProps {
  teamUUID: string
  onSuccess?: () => void
}

export function AddUserForm({ teamUUID, onSuccess }: AddUserFormProps) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [suggestions, setSuggestions] = useState<UserSearchResult[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let active = true
    const timer = window.setTimeout(async () => {
      setIsSearching(true)

      try {
        const users = await getUsers(email.trim())
        if (active) {
          setSuggestions(users)
        }
      } catch (error) {
        console.error("Erro ao buscar usuários:", error)
        if (active) setSuggestions([])
      } finally {
        if (active) setIsSearching(false)
      }
    }, 250)

    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [email])

  const handleAddUser = async () => {
    const trimmedEmail = email.trim()
    if (!trimmedEmail) return

    setIsLoading(true)

    try {
      await updateTeam(teamUUID, {
        usersToAdd: [trimmedEmail],
      })
      setEmail("")
      setShowSuggestions(false)
      setOpen(false)
      onSuccess?.()
    } catch (error) {
      console.error("Não foi possível adicionar o usuário ao time:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <UserPlus className="h-4 w-4" />
          Adicionar usuário
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-1">
          <DialogTitle>Adicionar usuário</DialogTitle>
          <DialogDescription>
            Informe o Email do usuário que deverá ser adicionado ao time.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="user-email">Email do usuário</Label>
            <div className="relative">
              <Input
                id="user-email"
                placeholder="usuario@exemplo.com"
                value={email}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => window.setTimeout(() => setShowSuggestions(false), 150)}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setShowSuggestions(true)
                }}
              />

              {showSuggestions && (
                <div className="absolute left-0 right-0 z-10 mt-1 max-h-60 overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-lg">
                  {isSearching ? (
                    <div className="p-3 text-sm text-muted-foreground">Buscando...</div>
                  ) : suggestions.length > 0 ? (
                    suggestions.map((user) => (
                      <button
                        type="button"
                        key={user.email}
                        className="flex w-full flex-col gap-1 border-b last:border-b-0 px-3 py-3 text-left text-sm hover:bg-accent/10"
                        onMouseDown={() => {
                          setEmail(user.email)
                          setShowSuggestions(false)
                        }}
                      >
                        <span className="font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-sm text-muted-foreground">Nenhum usuário encontrado.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            className="flex-1"
            onClick={handleAddUser}
            disabled={!email.trim() || isLoading}
          >
            {isLoading ? "Adicionando..." : "Adicionar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}