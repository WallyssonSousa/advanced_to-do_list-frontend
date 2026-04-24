"use client"

import { useState } from "react"
import { Settings2 } from "lucide-react"

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
import { Textarea } from "@/components/ui/textarea"
import { updateTeam } from "@/services/teamService"
import { UpdateTeamDTO } from "@/types/team"

interface TeamSettingsFormProps {
  teamUUID: string
  onSuccess?: () => void
}

export function TeamSettingsForm({ teamUUID, onSuccess }: TeamSettingsFormProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdateSettings = async () => {
    const payload: UpdateTeamDTO = {}

    if (name.trim()) payload.name = name.trim()
    if (description.trim()) payload.description = description.trim()
    if (!payload.name && !payload.description) return

    setIsLoading(true)

    try {
      await updateTeam(teamUUID, payload)
      setOpen(false)
      setName("")
      setDescription("")
      onSuccess?.()
    } catch (error) {
      console.error("Não foi possível atualizar as configurações do time:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <Settings2 className="h-4 w-4" />
          Configurações
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-1">
          <DialogTitle>Configurações do time</DialogTitle>
          <DialogDescription>
            Atualize o nome e a descrição do time.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="team-name">Nome do time</Label>
            <Input
              id="team-name"
              placeholder="Nome do time"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="team-description">Descrição</Label>
            <Textarea
              id="team-description"
              rows={4}
              placeholder="Descrição do time"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
            Fechar
          </Button>
          <Button
            className="flex-1"
            onClick={handleUpdateSettings}
            disabled={(!name.trim() && !description.trim()) || isLoading}
          >
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}