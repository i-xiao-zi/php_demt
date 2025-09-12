import { Command, TreeItemCollapsibleState } from "vscode";


interface Node {
    id: string;
    label: string;
    collapsibleState: TreeItemCollapsibleState;
    children?: Node[];
    icon?: string;
    command?: Command;
  }