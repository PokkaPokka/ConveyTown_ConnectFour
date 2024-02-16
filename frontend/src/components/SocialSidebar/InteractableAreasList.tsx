import { Box, Heading, ListItem, UnorderedList } from '@chakra-ui/react';
import React from 'react';
import {
  GenericInteractableAreaController,
  useInteractableAreaFriendlyName,
  useInteractableAreaOccupants,
} from '../../classes/interactable/InteractableAreaController';
import { useActiveInteractableAreas } from '../../classes/TownController';
import PlayerName from './PlayerName';

type InteractableAreaViewProps = {
  area: GenericInteractableAreaController;
};

/**
 * Displays a list of active interactable areas, along with their occupants
 *
 * If there are active areas, it sorts them by the number of occupants in the area, then label ascending
 */
function InteractableAreaView({ area }: InteractableAreaViewProps): JSX.Element {
  const occupants = useInteractableAreaOccupants(area);
  const friendlyNames = useInteractableAreaFriendlyName(area);

  return (
    <Box>
      <Heading as='h4' fontSize='m'>
        {friendlyNames}
      </Heading>
      <UnorderedList>
        {occupants.map(occupant => {
          return (
            <ListItem key={occupant.id}>
              <PlayerName player={occupant} />
            </ListItem>
          );
        })}
      </UnorderedList>
    </Box>
  );
}

/**
 * A react component that displays a list of all active interactable areas in the town.
 * The list is grouped by type of interactable area, with those groups sorted alphabetically
 * by the type name. Within each group, the areas are sorted first by the number of occupants
 * in the area, and then by the name of the area (alphanumerically).
 *
 * The list of interactable areas is represented as an ordered list, with each list item
 * containing the name of the area (in an H4 heading), and then a list of the occupants of the area, where
 * each occupant is shown as a PlayerName component.
 *
 * @returns A list of all active interactable areas in the town as per above spec
 */
export default function InteractableAreasList(): JSX.Element {
  const activeInteractableAreas = useActiveInteractableAreas();

  // Group areas by type and sort groups alphabetically by type name
  const groupedAreas: { [key: string]: GenericInteractableAreaController[] } =
    activeInteractableAreas.reduce(
      (
        groups: { [key: string]: GenericInteractableAreaController[] },
        area: GenericInteractableAreaController,
      ) => {
        (groups[area.type] = groups[area.type] || []).push(area);
        return groups;
      },
      {},
    );
  const areaTypes = Object.keys(groupedAreas).sort();

  if (areaTypes.length === 0) {
    return <>No active areas</>;
  }

  return (
    <Box>
      {areaTypes.map(type => (
        <Box key={type}>
          <Heading as='h3' fontSize='l'>
            {type}s
          </Heading>
          {groupedAreas[type]
            .sort((a1, a2) => {
              // Sort by number of occupants
              const occupantsComparison: number = a2.occupants.length - a1.occupants.length;
              // If number of occupants is the same, sort by name
              if (occupantsComparison === 0) {
                return a1.id.localeCompare(a2.id, undefined, {
                  numeric: true,
                  sensitivity: 'base',
                });
              }
              return occupantsComparison;
            })
            .map((area: GenericInteractableAreaController) => (
              <Box key={area.id}>{<InteractableAreaView area={area} />}</Box>
            ))}
        </Box>
      ))}
    </Box>
  );
}
