"use client"

import { useState } from "react"
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

interface AddUserFormProps {
  teamUUID: string
  onSuccess?: () => void
}

export function AddUserForm({ teamUUID, onSuccess }: AddUserFormProps) {
  const [open, setOpen] = useState(false)
  const [userUUID, setUserUUID] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleAddUser = async () => {
    const trimmedUUID = userUUID.trim()
    if (!trimmedUUID) return

    setIsLoading(true)

    try {
      await updateTeam(teamUUID, {
        usersToAdd: [trimmedUUID],
      })
      setUserUUID("")
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
            Informe o UUID do usuário que deverá ser adicionado ao time.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="user-uuid">UUID do usuário</Label>
            <Input
              id="user-uuid"
              placeholder="d0ab537d-f8f8-4bda-bd1c-e356c7416bcc"
              value={userUUID}
              onChange={(event) => setUserUUID(event.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            className="flex-1"
            onClick={handleAddUser}
            disabled={!userUUID.trim() || isLoading}
          >
            {isLoading ? "Adicionando..." : "Adicionar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}