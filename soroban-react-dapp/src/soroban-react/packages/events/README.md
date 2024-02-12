# @soroban-react/events

See the official gitbook: https://soroban-react.gitbook.io/index/
___

```javascript
import { useSorobanEvents, EventSubscription } from '@soroban-react/events'

const crowdfundPledgedEventSubscription: EventSubscription = {
      contractId: Constants.CrowdfundId, 
      topics: ['pledged_amount_changed'], 
      cb: (event: SorobanClient.SorobanRpc.EventResponse): void => {
        let eventTokenBalance = xdr.ScVal.fromXDR(event.value.xdr, 'base64')
        setTokenBalance(convert.scvalToBigNumber(eventTokenBalance))
      }, 
      id: Math.random()}

  const crowdfundTargetReachedSubscription: EventSubscription = {
      contractId: Constants.CrowdfundId, 
      topics: ['target_reached'], 
      cb: (event: SorobanClient.SorobanRpc.EventResponse): void => {
        setTargetReached(true)
      }, 
      id: Math.random()}

  const sorobanEventsContext = useSorobanEvents()
  React.useEffect(() => {
    const pledgedSubId = sorobanEventsContext.subscribe(crowdfundPledgedEventSubscription)
    const reachedSubId = sorobanEventsContext.subscribe(crowdfundTargetReachedSubscription)

    return () => {
      sorobanEventsContext.unsubscribe(pledgedSubId);
      sorobanEventsContext.unsubscribe(reachedSubId);
    }
  }, [sorobanEventsContext]);
```