import { Box, Heading, ListItem, UnorderedList } from '@chakra-ui/react';
import React from 'react';
import ConnectFourAreaController from '../../classes/interactable/ConnectFourAreaController';
import ConversationAreaController from '../../classes/interactable/ConversationAreaController';
import {
  useInteractableAreaFriendlyName,
  useInteractableAreaOccupants,
} from '../../classes/interactable/InteractableAreaController';
import TicTacToeAreaController from '../../classes/interactable/TicTacToeAreaController';
import ViewingAreaController from '../../classes/interactable/ViewingAreaController';
import {
  useActiveConversationAreas,
  useActiveInteractableAreas,
} from '../../classes/TownController';
import PlayerName from './PlayerName';

type ConversationAreaViewProps = {
  area: ConversationAreaController;
};

type GameAreaViewProps = {
  area: ConnectFourAreaController | TicTacToeAreaController;
};

type ViewingAreaViewProps = {
  area: ViewingAreaController;
};

/**
 * Displays a list of "active" conversation areas, along with their occupants
 *
 * A conversation area is "active" if its topic is not set to the constant NO_TOPIC_STRING that is exported from the ConverationArea file
 *
 * If there are active areas, it sorts them by label ascending
 *
 * See relevant hooks: useConversationAreas, usePlayersInTown.
 */
function ConversationAreaView({ area }: ConversationAreaViewProps): JSX.Element {
  const occupants = useInteractableAreaOccupants(area);
  const friendlyNames = useInteractableAreaFriendlyName(area);

  return (
    <Box>
      <Heading as='h3' fontSize='m'>
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
 * Displays a list of "active" game areas, along with their occupants
 *
 * A game area is "active" if its topic is not set to the constant NO_TOPIC_STRING that is exported from the InteractableArea file
 *
 * If there are active areas, it sorts them by label ascending
 */
function GameAeraView({ area }: GameAreaViewProps): JSX.Element {
  const occupants = useInteractableAreaOccupants(area);
  const friendlyNames = useInteractableAreaFriendlyName(area);

  return (
    <Box>
      <Heading as='h3' fontSize='m'>
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
 * Displays a list of "active" game areas, along with their occupants
 *
 * A game area is "active" if its topic is not set to the constant NO_TOPIC_STRING that is exported from the InteractableArea file
 *
 * If there are active areas, it sorts them by label ascending
 */
function ViewingAreaView({ area }: ViewingAreaViewProps): JSX.Element {
  const occupants = useInteractableAreaOccupants(area);
  const friendlyNames = useInteractableAreaFriendlyName(area);

  return (
    <Box>
      <Heading as='h5' fontSize='m'>
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
  const activeConversationAreas = useActiveConversationAreas();
  const activeGameAreas = useActiveInteractableAreas().filter(
    area => area instanceof ConnectFourAreaController || area instanceof TicTacToeAreaController,
  );
  const activeViewingAreas = useActiveInteractableAreas().filter(
    area => area instanceof ViewingAreaController,
  );

  return (
    <Box>
      {activeInteractableAreas.length === 0 ? (
        <>No active areas</>
      ) : (
        <>
          <>
            {activeConversationAreas.length === 0 ? null : (
              <>
                <Heading as='h4' fontSize='l'>
                  Conversation Areas:
                </Heading>
                {activeConversationAreas
                  .sort((a1, a2) =>
                    a1.id.localeCompare(a2.id, undefined, { numeric: true, sensitivity: 'base' }),
                  )
                  .map(area => (
                    <ConversationAreaView area={area} key={area.id} />
                  ))}
              </>
            )}
          </>
          <>
            {activeGameAreas.length === 0 ? null : (
              <>
                <Heading as='h4' fontSize='l'>
                  Game Areas:
                </Heading>
                {activeGameAreas
                  .sort((a1, a2) =>
                    a1.id.localeCompare(a2.id, undefined, { numeric: true, sensitivity: 'base' }),
                  )
                  .map(area => (
                    <GameAeraView
                      area={area as ConnectFourAreaController | TicTacToeAreaController}
                      key={area.id}
                    />
                  ))}
              </>
            )}
          </>
          <>
            {activeViewingAreas.length === 0 ? null : (
              <>
                <Heading as='h4' fontSize='l'>
                  Viewing Areas:
                </Heading>
                {activeViewingAreas
                  .sort((a1, a2) =>
                    a1.id.localeCompare(a2.id, undefined, { numeric: true, sensitivity: 'base' }),
                  )
                  .map(area => (
                    <ViewingAreaView area={area as ViewingAreaController} key={area.id} />
                  ))}
              </>
            )}
          </>
        </>
      )}
    </Box>
  );
}
