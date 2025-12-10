import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, X, ChevronRight, Grid, List } from "lucide-react";

interface ProductSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filteredProductsCount: number;
  activeFilterCount: number;
  viewMode: "grid" | "table";
  setViewMode: (mode: "grid" | "table") => void;
  children: React.ReactNode;
}

export const ProductSidebar = ({
  isOpen,
  onClose,
  filteredProductsCount,
  activeFilterCount,
  viewMode,
  setViewMode,
  children
}: ProductSidebarProps) => {
  return (
    <>
      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[85vw] md:w-[90vw] lg:w-[85vw] xl:w-[80vw] bg-background border-l shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <Card className="h-full rounded-none border-0 flex flex-col">
          <CardHeader className="pb-4 border-b flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Package className="w-5 h-5" />
                產品選擇
                <Badge variant="secondary" className="ml-2">
                  {filteredProductsCount} 項產品
                  {activeFilterCount > 0 && (
                    <Badge variant="destructive" className="ml-2 text-xs">
                      {activeFilterCount} 篩選
                    </Badge>
                  )}
                </Badge>
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-hidden flex flex-col p-6">
            {children}

            {/* 視圖切換 */}
            <div className="flex gap-1 border rounded-md w-fit mt-4">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="px-3"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="px-3"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
