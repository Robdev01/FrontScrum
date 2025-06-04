
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useScrumContext } from '../context/ScrumContext';
import { User, Users, Book } from 'lucide-react';

export const RoleSelector: React.FC = () => {
  const { currentRole, setCurrentRole } = useScrumContext();

  const handleRoleChange = (value: string) => {
    setCurrentRole(value as any);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium hidden sm:inline">Papel atual:</span>
      <Select value={currentRole} onValueChange={handleRoleChange}>
        <SelectTrigger className="w-[180px] bg-white/10 text-primary-foreground border-white/20">
          <SelectValue placeholder="Selecione um papel" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="product-owner" className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Book className="h-4 w-4 text-scrum-po" />
              <span>Product Owner</span>
            </div>
          </SelectItem>
          <SelectItem value="scrum-master">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-scrum-sm" />
              <span>Scrum Master</span>
            </div>
          </SelectItem>
          <SelectItem value="developer">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-scrum-dev" />
              <span>Desenvolvedor</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
