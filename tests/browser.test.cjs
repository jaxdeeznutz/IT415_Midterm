const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch(process.env.BROWSER_EXE?{executablePath:process.env.BROWSER_EXE,headless:true}:{channel:'msedge',headless:true});
 try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(path.resolve(__dirname,'../index.html')).href);
 const click=a=>page.locator(`[data-action="${a}"]`).click();
 const add=id=>page.locator(`.product[data-id="${id}"]`).click();
 const value=()=>page.locator('[data-testid="total"]').textContent();
 assert.equal(await page.locator('.product').count(),6);assert.equal(await page.locator('[data-action="review"]').isDisabled(),true);
 await add('coffee');await add('coffee');await add('sandwich');await add('soda');assert.equal(await value(),'₱175.00');
 await page.locator('.qty [data-action="add"][data-id="coffee"]').click();assert.equal(await value(),'₱220.00');
 await page.locator('[data-action="minus"][data-id="coffee"]').click();assert.equal(await value(),'₱175.00');
 await page.locator('[data-action="remove"][data-id="soda"]').click();assert.equal(await value(),'₱140.00');
 await click('review');assert.ok((await page.locator('table').textContent()).includes('₱90.00'));await click('order');assert.equal(await value(),'₱140.00');await add('soda');
 await click('review');await click('methods');await click('cash');
 for(const bad of ['', '-10','abc','175.001','100']){await page.locator('#cash').fill(bad);await click('pay');assert.equal(await page.locator('#cash-error').isVisible(),true);assert.equal(await page.locator('h1').textContent(),'Cash Payment');}
 await page.locator('#cash').fill('200');assert.equal(await page.locator('#change').textContent(),'₱25.00');await click('pay');await page.waitForSelector('[data-action="receipt"]');assert.equal(await page.locator('h1').textContent(),'Payment Successful');
 const refs=[await page.locator('.reference').textContent()];
 const fields=async selector=>page.locator(`${selector} dl div`).evaluateAll(rows=>Object.fromEntries(rows.map(row=>[row.querySelector('dt').textContent,row.querySelector('dd').textContent])));
 const success=await fields('.success');
 assert.equal(success['Payment method'],'Cash');assert.equal(success['Transaction amount'],'₱175.00');assert.equal(success['Amount paid'],'₱200.00');assert.equal(success.Change,'₱25.00');assert.match(success['Date / time'],/PHT/);
 assert.equal(await page.locator('h1').evaluate(el=>el===document.activeElement),true);
 for(const width of [1440,768,390]){await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.equal(await page.locator('.success button').evaluateAll(bs=>bs.every(b=>b.getBoundingClientRect().height>=52)),true);if(process.env.QA_DIR)await page.screenshot({path:path.join(process.env.QA_DIR,`success-${width}.png`),fullPage:true,animations:'disabled'});}
 await click('receipt');const receipt=await fields('.receipt');
 for(const key of ['Transaction reference','Date / time','Payment method','Amount paid','Change'])assert.equal(receipt[key],success[key]);
 assert.equal(await page.locator('.receipt tbody tr').count(),3);assert.equal(await page.locator('.receipt tbody tr').first().locator('td').first().textContent(),'2');
 assert.ok((await page.locator('.receipt').textContent()).includes('2 × ₱45.00'));
 await click('success');assert.deepEqual(await fields('.success'),success);await click('receipt');
 await page.evaluate(()=>{window.printCalls=0;window.print=()=>window.printCalls++;});await click('print');assert.equal(await page.evaluate(()=>window.printCalls),1);
 await page.emulateMedia({media:'print'});assert.equal(await page.locator('header').isVisible(),false);assert.equal(await page.locator('.receipt-actions').isVisible(),false);assert.equal(await page.locator('.receipt').isVisible(),true);await page.emulateMedia({media:'screen'});
 for(const width of [1440,768,390]){await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.equal(await page.locator('.receipt-actions button').evaluateAll(bs=>bs.every(b=>b.getBoundingClientRect().height>=52)),true);if(process.env.QA_DIR)await page.screenshot({path:path.join(process.env.QA_DIR,`receipt-${width}.png`),fullPage:true,animations:'disabled'});}
 await click('reset');assert.equal(await value(),'₱0.00');assert.equal(await page.locator('.cart-item').count(),0);assert.equal(await page.locator('.reference').count(),0);
 for(const method of ['cash','qr','card']){await add('coffee');await click('review');await click('methods');await click(method);if(method==='cash'){assert.equal(await page.locator('#cash').inputValue(),'');await page.locator('[data-action="quick"]').first().click();await click('pay');}else if(method==='qr')await click('confirm');else{await click('process');assert.equal(await page.locator('[data-action="methods"]').isDisabled(),true);await page.waitForSelector('[data-action="receipt"]');}await page.waitForSelector('[data-action="receipt"]');refs.push(await page.locator('.reference').textContent());await click('receipt');const txt=await page.locator('.receipt').textContent();assert.ok(txt.includes(method==='cash'?'Cash':method==='qr'?'QR Payment':'Credit / Debit Card'));assert.ok(txt.includes('₱0.00'));await click('reset');}
 // Reset directly from success also clears category, cash and completed state.
 await page.locator('[data-action="filter"][data-category="Drinks"]').click();await add('coffee');await click('review');await click('methods');await click('cash');await page.locator('#cash').fill('100');await click('pay');await page.waitForSelector('[data-action="receipt"]');await click('reset');
 assert.equal(await value(),'₱0.00');assert.equal(await page.locator('.filters .selected').textContent(),'All');assert.equal(await page.locator('.product').count(),6);assert.equal(await page.locator('[data-action="review"]').isDisabled(),true);assert.equal(await page.locator('.reference').count(),0);assert.equal(await page.locator('h1').evaluate(el=>el===document.activeElement),true);
 // Payment navigation, keypad editing, processing locks and responsive touch targets.
 await add('coffee');await click('review');await click('methods');await click('cash');
 assert.equal(await page.locator('.method[aria-pressed="true"]').getAttribute('data-action'),'cash');
 const key=v=>page.locator(`[data-action="key"][data-value="${v}"]`).click();
 await key('4');await key('0');assert.match(await page.locator('#cash-error').textContent(),/short by/);
 await page.getByRole('button',{name:'Backspace',exact:true}).click();await key('5');await key('.');await key('2');await key('5');
 assert.equal(await page.locator('#cash').inputValue(),'45.25');
 await click('clear');assert.equal(await page.locator('#cash').inputValue(),'');
 await click('methods');await click('review');await click('order');assert.equal(await value(),'\u20b145.00');
 await click('review');await click('methods');
 for(const width of [1440,768,390]){
  await page.setViewportSize({width,height:1000});
  for(const method of ['cash','qr','card']){
   await click(method);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${method} at ${width}px`);
   assert.equal(await page.locator('.payment-panel button').evaluateAll(bs=>bs.every(b=>b.getBoundingClientRect().height>=52)),true);
   if(process.env.QA_DIR)await page.screenshot({path:path.join(process.env.QA_DIR,`payment-${method}-${width}.png`),fullPage:true,animations:'disabled'});
  }
 }
 await click('qr');await click('confirm');
 assert.match(await page.locator('.payment-status').textContent(),/Processing/);
 assert.equal(await page.locator('.payment-panel button:enabled').count(),0);
 await page.locator('[data-action="confirm"]').dispatchEvent('click');
 await page.waitForSelector('[data-action="receipt"]');await click('receipt');await click('reset');
 assert.equal(new Set(refs).size,4);
 for(const width of [1440,768,390]){await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);if(process.env.QA_DIR)await page.screenshot({path:path.join(process.env.QA_DIR,`order-${width}.png`),fullPage:true,animations:'disabled'});}
 assert.deepEqual(errors,[]);console.log('PASS: cart, review/back, invalid/insufficient/exact/excess cash, QR, card lock, receipts, unique references, reset, 3 responsive widths, no JS errors.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
