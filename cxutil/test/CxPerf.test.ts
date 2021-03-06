import { perf }    from '../mod.ts'
import { expect }  from 'https://deno.land/x/expect/mod.ts'
import { delay }   from "https://deno.land/std/async/delay.ts"

Deno.test('Performance: It should mark and log a measurement',  async ()  => {
    perf.mark('T1') 
    await delay(1000)
    perf.mark('T1')
    let measure = perf.get('T1')
    expect( measure ).toBeDefined()
    expect( measure.token).toEqual('T1')
    expect( measure.ms ).toBeGreaterThan(1000)
})
