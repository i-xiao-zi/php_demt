import { Command, ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { Node } from "./types";

const data: Node[] = [
    {
      id: 'first',
      label: 'First Item',
      collapsibleState: TreeItemCollapsibleState.Collapsed,
      icon: 'folder',
      children: [
        { id: 'first-a', label: 'A child', collapsibleState: TreeItemCollapsibleState.None, icon: 'file' },
        { id: 'first-b', label: 'B child', collapsibleState: TreeItemCollapsibleState.None, icon: 'file' }
      ]
    },
    {
      id: 'second',
      label: 'Second Item',
      collapsibleState: TreeItemCollapsibleState.Expanded,
      icon: 'folder',
      children: [
        { id: 'second-1', label: '1 child', collapsibleState: TreeItemCollapsibleState.None, icon: 'file' },
        { id: 'second-2', label: '2 child', collapsibleState: TreeItemCollapsibleState.None, icon: 'file' }
      ]
    }
  ];
  

  export default data;