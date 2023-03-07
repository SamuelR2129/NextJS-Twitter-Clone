import tw from 'tailwind-styled-components';

const SidebarMenuItemContainerDiv = tw.div`
  hoverEffect 
  flex 
  items-center 
  text-gray-700 
  justify-center 
  xl:justify-start 
  text-lg 
  space-x-3
`;

type SidebarMenuItemTypes = {
  text: string;
  Icon: React.ElementType;
  active?: boolean;
};

const SidebarMenuItem = ({
  text,
  Icon,
  active
}: SidebarMenuItemTypes): JSX.Element => {
  return (
    <SidebarMenuItemContainerDiv>
      <Icon className="h-7"></Icon>
      <span className={`${active && 'font-bold'} hidden xl:inline`}>
        {text}
      </span>
    </SidebarMenuItemContainerDiv>
  );
};

export default SidebarMenuItem;
